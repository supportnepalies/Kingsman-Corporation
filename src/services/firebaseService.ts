import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';

import { db, handleFirestoreError, OperationType } from '../firebase';

import {
  CompanionProfile,
  ClientProfile,
  CompanionApplication,
  BookingRequest,
  Message,
  AppNotification,
  ReportItem,
  SupportTicket,
  PaymentPlaceholder,
  MediaItem,
  Testimonial,
  SiteSettings
} from '../types';

import {
  INITIAL_COMPANION_PROFILES,
  INITIAL_TESTIMONIALS,
  INITIAL_SITE_SETTINGS,
  INITIAL_PAYMENT_PLACEHOLDERS
} from './mockInitialData';

// Local storage caches for seamless testing and offline fallbacks
const LOCAL_STORAGE_KEYS = {
  COMPANIONS: 'kingsman_companions_v2',
  APPLICATIONS: 'kingsman_applications_v2',
  BOOKINGS: 'kingsman_bookings_v2',
  MESSAGES: 'kingsman_messages_v2',
  NOTIFICATIONS: 'kingsman_notifications_v2',
  REPORTS: 'kingsman_reports_v2',
  SUPPORT: 'kingsman_support_v2',
  PAYMENTS: 'kingsman_payments_v2',
  MEDIA: 'kingsman_media_v2',
  TESTIMONIALS: 'kingsman_testimonials_v2',
  SETTINGS: 'kingsman_settings_v2',
  CLIENT_PROFILES: 'kingsman_client_profiles_v2'
};

function getLocalData<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 3000
): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(
        new Error(
          `Firestore request timed out after ${timeoutMs}ms`
        )
      );
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutHandle!);
  }
}

// ----------------- COMPANION PROFILES -----------------

export async function fetchCompanionProfiles(): Promise<CompanionProfile[]> {
  try {
    const colRef = collection(db, 'companionProfiles');

    const q = query(
      colRef,
      where('isPublished', '==', true)
    );

    const snap = await withTimeout(
      getDocs(q),
      3000
    );

    if (!snap.empty) {
      const list = snap.docs.map(
        d =>
          ({
            ...d.data(),
            id: d.id
          } as CompanionProfile)
      );

      setLocalData(
        LOCAL_STORAGE_KEYS.COMPANIONS,
        list
      );

      return list;
    }
  } catch (err) {
    console.warn(
      'Firestore companion fetch notice:',
      err
    );
  }

  const cached = getLocalData<CompanionProfile[]>(
    LOCAL_STORAGE_KEYS.COMPANIONS,
    INITIAL_COMPANION_PROFILES
  );

  return cached.filter(
    profile => profile.isPublished === true
  );
}

export async function fetchCompanionProfileById(
  id: string
): Promise<CompanionProfile | null> {
  try {
    const docRef = doc(
      db,
      'companionProfiles',
      id
    );

    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as CompanionProfile;

      if (data.isPublished === true) {
        return {
          ...data,
          id: snap.id
        };
      }
    }
  } catch (err) {
    console.warn(
      'Firestore single companion lookup error:',
      err
    );
  }

  const profiles = await fetchCompanionProfiles();

  return (
    profiles.find(
      profile => profile.id === id
    ) || null
  );
}

export async function saveCompanionProfile(
  profile: CompanionProfile
): Promise<void> {
  const profileId =
    profile.id ||
    `companion-${Date.now()}`;

  const data = {
    ...profile,
    id: profileId,
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = doc(
      db,
      'companionProfiles',
      profileId
    );

    await setDoc(
      docRef,
      data,
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.WRITE,
      `companionProfiles/${profileId}`
    );
  } finally {
    const list =
      getLocalData<CompanionProfile[]>(
        LOCAL_STORAGE_KEYS.COMPANIONS,
        INITIAL_COMPANION_PROFILES
      );

    const idx = list.findIndex(
      p => p.id === profileId
    );

    if (idx >= 0) {
      list[idx] = data;
    } else {
      list.unshift(data);
    }

    setLocalData(
      LOCAL_STORAGE_KEYS.COMPANIONS,
      list
    );
  }
}

export async function deleteCompanionProfile(
  id: string
): Promise<void> {
  try {
    const docRef = doc(
      db,
      'companionProfiles',
      id
    );

    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.DELETE,
      `companionProfiles/${id}`
    );
  } finally {
    const list =
      getLocalData<CompanionProfile[]>(
        LOCAL_STORAGE_KEYS.COMPANIONS,
        INITIAL_COMPANION_PROFILES
      );

    const filtered =
      list.filter(
        p => p.id !== id
      );

    setLocalData(
      LOCAL_STORAGE_KEYS.COMPANIONS,
      filtered
    );
  }
}

// ----------------- CLIENT PROFILES -----------------

export async function fetchClientProfile(
  uid: string
): Promise<ClientProfile | null> {
  try {
    const docRef = doc(
      db,
      'clientProfiles',
      uid
    );

    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return {
        ...snap.data(),
        id: snap.id
      } as ClientProfile;
    }
  } catch (err) {
    console.warn(
      'Client profile read notice:',
      err
    );
  }

  const list =
    getLocalData<Record<string, ClientProfile>>(
      LOCAL_STORAGE_KEYS.CLIENT_PROFILES,
      {}
    );

  return list[uid] || null;
}

export async function saveClientProfile(
  profile: ClientProfile
): Promise<void> {
  const data = {
    ...profile,
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = doc(
      db,
      'clientProfiles',
      profile.uid
    );

    await setDoc(
      docRef,
      data,
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.WRITE,
      `clientProfiles/${profile.uid}`
    );
  } finally {
    const dict =
      getLocalData<Record<string, ClientProfile>>(
        LOCAL_STORAGE_KEYS.CLIENT_PROFILES,
        {}
      );

    dict[profile.uid] = data;

    setLocalData(
      LOCAL_STORAGE_KEYS.CLIENT_PROFILES,
      dict
    );
  }
}

// ----------------- COMPANION APPLICATIONS -----------------

export async function submitCompanionApplication(
  payload: Omit<
    CompanionApplication,
    'id' | 'createdAt' | 'updatedAt' | 'status'
  >
): Promise<CompanionApplication> {
  const appId =
    `app-${Date.now()}`;

  const now =
    new Date().toISOString();

  const application: CompanionApplication = {
    ...payload,
    id: appId,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };

  try {
    const docRef = doc(
      db,
      'companionApplications',
      appId
    );

    await setDoc(
      docRef,
      application
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.CREATE,
      `companionApplications/${appId}`
    );
  } finally {
    const list =
      getLocalData<CompanionApplication[]>(
        LOCAL_STORAGE_KEYS.APPLICATIONS,
        []
      );

    list.unshift(application);

    setLocalData(
      LOCAL_STORAGE_KEYS.APPLICATIONS,
      list
    );
  }

  return application;
}

export async function fetchCompanionApplications(): Promise<
  CompanionApplication[]
> {
  try {
    const colRef =
      collection(
        db,
        'companionApplications'
      );

    const snap =
      await getDocs(colRef);

    if (!snap.empty) {
      return snap.docs.map(
        d =>
          ({
            ...d.data(),
            id: d.id
          } as CompanionApplication)
      );
    }
  } catch (err) {
    console.warn(
      'Fetch applications notice:',
      err
    );
  }

  return getLocalData<CompanionApplication[]>(
    LOCAL_STORAGE_KEYS.APPLICATIONS,
    []
  );
}

export async function updateApplicationStatus(
  id: string,
  status: 'approved' | 'rejected',
  notes?: string
): Promise<void> {
  try {
    const docRef = doc(
      db,
      'companionApplications',
      id
    );

    await updateDoc(
      docRef,
      {
        status,
        adminNotes: notes || '',
        updatedAt:
          new Date().toISOString()
      }
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.UPDATE,
      `companionApplications/${id}`
    );
  } finally {
    const list =
      getLocalData<CompanionApplication[]>(
        LOCAL_STORAGE_KEYS.APPLICATIONS,
        []
      );

    const idx =
      list.findIndex(
        a => a.id === id
      );

    if (idx >= 0) {
      list[idx].status = status;

      if (notes) {
        list[idx].adminNotes = notes;
      }

      list[idx].updatedAt =
        new Date().toISOString();

      setLocalData(
        LOCAL_STORAGE_KEYS.APPLICATIONS,
        list
      );
    }
  }
}

// ----------------- BOOKING REQUESTS -----------------

export async function submitBookingRequest(
  booking: Omit<
    BookingRequest,
    'id' |
    'referenceNumber' |
    'status' |
    'createdAt' |
    'updatedAt'
  >
): Promise<BookingRequest> {
  const refNum =
    `KC-${Math.floor(
      100000 +
      Math.random() * 900000
    )}`;

  const bookingId =
    `book-${Date.now()}`;

  const now =
    new Date().toISOString();

  const newBooking: BookingRequest = {
    ...booking,
    id: bookingId,
    referenceNumber: refNum,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };

  try {
    const docRef = doc(
      db,
      'bookingRequests',
      bookingId
    );

    await setDoc(
      docRef,
      newBooking
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.CREATE,
      `bookingRequests/${bookingId}`
    );
  } finally {
    const list =
      getLocalData<BookingRequest[]>(
        LOCAL_STORAGE_KEYS.BOOKINGS,
        []
      );

    list.unshift(newBooking);

    setLocalData(
      LOCAL_STORAGE_KEYS.BOOKINGS,
      list
    );

    await addNotification({
      recipientId:
        booking.clientId,
      title:
        'Booking Request Received',
      message:
        `Your lawful companionship request for ${booking.companionDisplayName} (Ref: ${refNum}) has been submitted to the Kingsman Corporation concierge.`,
      link:
        '/dashboard',
      isRead:
        false
    });
  }

  return newBooking;
}

export async function fetchClientBookings(
  clientId: string
): Promise<BookingRequest[]> {
  try {
    const q =
      query(
        collection(
          db,
          'bookingRequests'
        ),
        where(
          'clientId',
          '==',
          clientId
        )
      );

    const snap =
      await getDocs(q);

    if (!snap.empty) {
      return snap.docs.map(
        d =>
          ({
            ...d.data(),
            id: d.id
          } as BookingRequest)
      );
    }
  } catch (err) {
    console.warn(
      'Booking client query notice:',
      err
    );
  }

  const list =
    getLocalData<BookingRequest[]>(
      LOCAL_STORAGE_KEYS.BOOKINGS,
      []
    );

  return list.filter(
    b => b.clientId === clientId
  );
}

export async function fetchAllBookings(): Promise<
  BookingRequest[]
> {
  try {
    const snap =
      await getDocs(
        collection(
          db,
          'bookingRequests'
        )
      );

    if (!snap.empty) {
      return snap.docs.map(
        d =>
          ({
            ...d.data(),
            id: d.id
          } as BookingRequest)
      );
    }
  } catch (err) {
    console.warn(
      'All bookings query notice:',
      err
    );
  }

  return getLocalData<BookingRequest[]>(
    LOCAL_STORAGE_KEYS.BOOKINGS,
    []
  );
}

export async function updateBookingStatus(
  id: string,
  status: BookingRequest['status'],
  adminNotes?: string
): Promise<void> {
  const updatePayload: Record<
    string,
    any
  > = {
    status,
    updatedAt:
      new Date().toISOString()
  };

  if (
    adminNotes !== undefined
  ) {
    updatePayload.adminNotes =
      adminNotes;
  }

  try {
    const docRef = doc(
      db,
      'bookingRequests',
      id
    );

    await updateDoc(
      docRef,
      updatePayload
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.UPDATE,
      `bookingRequests/${id}`
    );
  } finally {
    const list =
      getLocalData<BookingRequest[]>(
        LOCAL_STORAGE_KEYS.BOOKINGS,
        []
      );

    const idx =
      list.findIndex(
        b => b.id === id
      );

    if (idx >= 0) {
      list[idx].status =
        status;

      if (
        adminNotes !== undefined
      ) {
        list[idx].adminNotes =
          adminNotes;
      }

      list[idx].updatedAt =
        new Date().toISOString();

      setLocalData(
        LOCAL_STORAGE_KEYS.BOOKINGS,
        list
      );

      await addNotification({
        recipientId:
          list[idx].clientId,
        title:
          `Booking Update: ${status.toUpperCase()}`,
        message:
          `Your booking (Ref: ${list[idx].referenceNumber}) status has been updated to "${status}".`,
        link:
          '/dashboard',
        isRead:
          false
      });
    }
  }
}

// ----------------- MESSAGES -----------------

export async function fetchMessages(
  userId: string,
  isAdmin: boolean
): Promise<Message[]> {
  try {
    const colRef =
      collection(
        db,
        'messages'
      );

    if (isAdmin) {
      const q =
        query(
          colRef,
          orderBy(
            'createdAt',
            'asc'
          )
        );

      const snap =
        await getDocs(q);

      if (!snap.empty) {
        return snap.docs.map(
          d =>
            ({
              ...d.data(),
              id: d.id
            } as Message)
        );
      }
    } else {
      const [
        sentSnap,
        receivedSnap
      ] =
        await Promise.all([
          getDocs(
            query(
              colRef,
              where(
                'senderId',
                '==',
                userId
              )
            )
          ),
          getDocs(
            query(
              colRef,
              where(
                'recipientId',
                '==',
                userId
              )
            )
          )
        ]);

      const messages =
        new Map<
          string,
          Message
        >();

      sentSnap.docs.forEach(
        d => {
          messages.set(
            d.id,
            {
              ...d.data(),
              id: d.id
            } as Message
          );
        }
      );

      receivedSnap.docs.forEach(
        d => {
          messages.set(
            d.id,
            {
              ...d.data(),
              id: d.id
            } as Message
          );
        }
      );

      if (
        messages.size > 0
      ) {
        return Array.from(
          messages.values()
        ).sort(
          (a, b) =>
            a.createdAt.localeCompare(
              b.createdAt
            )
        );
      }
    }
  } catch (err) {
    console.warn(
      'Messages read notice:',
      err
    );
  }

  const list =
    getLocalData<Message[]>(
      LOCAL_STORAGE_KEYS.MESSAGES,
      []
    );

  if (isAdmin) {
    return list;
  }

  return list.filter(
    m =>
      m.senderId === userId ||
      m.recipientId === userId
  );
}

export async function sendMessage(
  msg: Omit<
    Message,
    'id' |
    'createdAt' |
    'isRead'
  >
): Promise<Message> {
  const msgId =
    `msg-${Date.now()}`;

  const now =
    new Date().toISOString();

  const message: Message = {
    ...msg,
    id: msgId,
    isRead: false,
    createdAt: now
  };

  try {
    const docRef =
      doc(
        db,
        'messages',
        msgId
      );

    await setDoc(
      docRef,
      message
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.CREATE,
      `messages/${msgId}`
    );
  } finally {
    const list =
      getLocalData<Message[]>(
        LOCAL_STORAGE_KEYS.MESSAGES,
        []
      );

    list.push(message);

    setLocalData(
      LOCAL_STORAGE_KEYS.MESSAGES,
      list
    );

    // Only admin messages create
    // cross-user notifications.
    if (
      msg.senderRole !==
      'client'
    ) {
      await addNotification({
        recipientId:
          msg.recipientId,
        title:
          `New Message from ${msg.senderName}`,
        message:
          msg.content.slice(
            0,
            100
          ) +
          (
            msg.content.length > 100
              ? '...'
              : ''
          ),
        link:
          '/dashboard',
        isRead:
          false
      });
    }
  }

  return message;
}

// ----------------- NOTIFICATIONS -----------------

export async function fetchNotifications(
  userId: string
): Promise<AppNotification[]> {
  try {
    const q =
      query(
        collection(
          db,
          'notifications'
        ),
        where(
          'recipientId',
          '==',
          userId
        )
      );

    const snap =
      await getDocs(q);

    if (!snap.empty) {
      return snap.docs.map(
        d =>
          ({
            ...d.data(),
            id: d.id
          } as AppNotification)
      );
    }
  } catch (err) {
    console.warn(
      'Notifications read notice:',
      err
    );
  }

  const list =
    getLocalData<AppNotification[]>(
      LOCAL_STORAGE_KEYS.NOTIFICATIONS,
      []
    );

  return list.filter(
    n =>
      n.recipientId === userId ||
      n.recipientId === 'all'
  );
}

export async function addNotification(
  notif: Omit<
    AppNotification,
    'id' | 'createdAt'
  >
): Promise<void> {
  const notifId =
    `notif-${Date.now()}`;

  const item: AppNotification = {
    ...notif,
    id: notifId,
    createdAt:
      new Date().toISOString()
  };

  try {
    const docRef =
      doc(
        db,
        'notifications',
        notifId
      );

    await setDoc(
      docRef,
      item
    );
  } catch (err) {
    console.warn(
      'Add notification notice:',
      err
    );
  } finally {
    const list =
      getLocalData<AppNotification[]>(
        LOCAL_STORAGE_KEYS.NOTIFICATIONS,
        []
      );

    list.unshift(item);

    setLocalData(
      LOCAL_STORAGE_KEYS.NOTIFICATIONS,
      list
    );
  }
}

export async function markNotificationRead(
  id: string
): Promise<void> {
  try {
    const docRef =
      doc(
        db,
        'notifications',
        id
      );

    await updateDoc(
      docRef,
      {
        isRead: true
      }
    );
  } catch (err) {
    console.warn(
      'Notification mark read notice:',
      err
    );
  } finally {
    const list =
      getLocalData<AppNotification[]>(
        LOCAL_STORAGE_KEYS.NOTIFICATIONS,
        []
      );

    const idx =
      list.findIndex(
        n => n.id === id
      );

    if (idx >= 0) {
      list[idx].isRead =
        true;

      setLocalData(
        LOCAL_STORAGE_KEYS.NOTIFICATIONS,
        list
      );
    }
  }
}

// ----------------- REPORTS & MODERATION -----------------

export async function submitReport(
  report: Omit<
    ReportItem,
    'id' | 'createdAt' | 'status'
  >
): Promise<ReportItem> {
  const reportId =
    `rep-${Date.now()}`;

  const item: ReportItem = {
    ...report,
    id: reportId,
    status: 'new',
    createdAt:
      new Date().toISOString()
  };

  try {
    const docRef =
      doc(
        db,
        'reports',
        reportId
      );

    await setDoc(
      docRef,
      item
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.CREATE,
      `reports/${reportId}`
    );
  } finally {
    const list =
      getLocalData<ReportItem[]>(
        LOCAL_STORAGE_KEYS.REPORTS,
        []
      );

    list.unshift(item);

    setLocalData(
      LOCAL_STORAGE_KEYS.REPORTS,
      list
    );
  }

  return item;
}

export async function fetchReports(): Promise<
  ReportItem[]
> {
  try {
    const snap =
      await getDocs(
        collection(
          db,
          'reports'
        )
      );

    if (!snap.empty) {
      return snap.docs.map(
        d =>
          ({
            ...d.data(),
            id: d.id
          } as ReportItem)
      );
    }
  } catch (err) {
    console.warn(
      'Reports read notice:',
      err
    );
  }

  return getLocalData<ReportItem[]>(
    LOCAL_STORAGE_KEYS.REPORTS,
    []
  );
}

export async function updateReportStatus(
  id: string,
  status: ReportItem['status'],
  notes?: string
): Promise<void> {
  try {
    const docRef =
      doc(
        db,
        'reports',
        id
      );

    await updateDoc(
      docRef,
      {
        status,
        resolutionNotes:
          notes || ''
      }
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.UPDATE,
      `reports/${id}`
    );
  } finally {
    const list =
      getLocalData<ReportItem[]>(
        LOCAL_STORAGE_KEYS.REPORTS,
        []
      );

    const idx =
      list.findIndex(
        r => r.id === id
      );

    if (idx >= 0) {
      list[idx].status =
        status;

      if (notes) {
        list[idx].resolutionNotes =
          notes;
      }

      setLocalData(
        LOCAL_STORAGE_KEYS.REPORTS,
        list
      );
    }
  }
}

// ----------------- SUPPORT TICKETS -----------------

export async function submitSupportTicket(
  ticket: Omit<
    SupportTicket,
    'id' | 'createdAt' | 'status'
  >
): Promise<SupportTicket> {
  const ticketId =
    `ticket-${Date.now()}`;

  const item: SupportTicket = {
    ...ticket,
    id: ticketId,
    status: 'new',
    createdAt:
      new Date().toISOString()
  };

  try {
    const docRef =
      doc(
        db,
        'supportTickets',
        ticketId
      );

    await setDoc(
      docRef,
      item
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.CREATE,
      `supportTickets/${ticketId}`
    );
  } finally {
    const list =
      getLocalData<SupportTicket[]>(
        LOCAL_STORAGE_KEYS.SUPPORT,
        []
      );

    list.unshift(item);

    setLocalData(
      LOCAL_STORAGE_KEYS.SUPPORT,
      list
    );
  }

  return item;
}

export async function fetchSupportTickets(): Promise<
  SupportTicket[]
> {
  try {
    const snap =
      await getDocs(
        collection(
          db,
          'supportTickets'
        )
      );

    if (!snap.empty) {
      return snap.docs.map(
        d =>
          ({
            ...d.data(),
            id: d.id
          } as SupportTicket)
      );
    }
  } catch (err) {
    console.warn(
      'Support tickets query notice:',
      err
    );
  }

  return getLocalData<SupportTicket[]>(
    LOCAL_STORAGE_KEYS.SUPPORT,
    []
  );
}

// ----------------- PAYMENTS -----------------

export async function fetchPayments(): Promise<
  PaymentPlaceholder[]
> {
  try {
    const snap =
      await getDocs(
        collection(
          db,
          'payments'
        )
      );

    if (!snap.empty) {
      return snap.docs.map(
        d =>
          ({
            ...d.data(),
            id: d.id
          } as PaymentPlaceholder)
      );
    }
  } catch (err) {
    console.warn(
      'Payments query notice:',
      err
    );
  }

  return getLocalData<PaymentPlaceholder[]>(
    LOCAL_STORAGE_KEYS.PAYMENTS,
    INITIAL_PAYMENT_PLACEHOLDERS
  );
}

export async function addPaymentPlaceholder(
  record: Omit<
    PaymentPlaceholder,
    'id'
  >
): Promise<PaymentPlaceholder> {
  const id =
    `pay-${Date.now()}`;

  const data: PaymentPlaceholder = {
    ...record,
    id
  };

  try {
    const docRef =
      doc(
        db,
        'payments',
        id
      );

    await setDoc(
      docRef,
      data
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.CREATE,
      `payments/${id}`
    );
  } finally {
    const list =
      getLocalData<PaymentPlaceholder[]>(
        LOCAL_STORAGE_KEYS.PAYMENTS,
        INITIAL_PAYMENT_PLACEHOLDERS
      );

    list.unshift(data);

    setLocalData(
      LOCAL_STORAGE_KEYS.PAYMENTS,
      list
    );
  }

  return data;
}

// ----------------- MEDIA LIBRARY -----------------

export async function fetchMedia(): Promise<
  MediaItem[]
> {
  try {
    const snap =
      await getDocs(
        collection(
          db,
          'media'
        )
      );

    if (!snap.empty) {
      return snap.docs.map(
        d =>
          ({
            ...d.data(),
            id: d.id
          } as MediaItem)
      );
    }
  } catch (err) {
    console.warn(
      'Media query notice:',
      err
    );
  }

  return getLocalData<MediaItem[]>(
    LOCAL_STORAGE_KEYS.MEDIA,
    [
      {
        id: 'media-logo',
        title:
          'Official Brand Emblem Logo - Kingsman Corporation',
        url:
          '/src/assets/images/kingsman_logo_1790586914061.jpg',
        type: 'image',
        category: 'branding',
        uploadedBy: 'admin',
        createdAt:
          '2026-09-28T00:00:00Z'
      },
      {
        id: 'media-1',
        title:
          'Hero Atmosphere - Indian Married Woman High-End Lounge',
        url:
          '/src/assets/images/hero_indian_married_woman_1790523916791.jpg',
        type: 'image',
        category: 'hero',
        uploadedBy: 'admin',
        createdAt:
          '2026-09-01T00:00:00Z'
      },
      {
        id: 'media-2',
        title:
          'Editorial - Indian Married Women Cultural Conversation',
        url:
          '/src/assets/images/story_indian_married_women_1790523969019.jpg',
        type: 'image',
        category: 'editorial',
        uploadedBy: 'admin',
        createdAt:
          '2026-09-01T00:00:00Z'
      }
    ]
  );
}

export async function addMedia(
  item: Omit<
    MediaItem,
    'id' | 'createdAt'
  >
): Promise<MediaItem> {
  const id =
    `media-${Date.now()}`;

  const media: MediaItem = {
    ...item,
    id,
    createdAt:
      new Date().toISOString()
  };

  try {
    const docRef =
      doc(
        db,
        'media',
        id
      );

    await setDoc(
      docRef,
      media
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.CREATE,
      `media/${id}`
    );
  } finally {
    const list =
      await fetchMedia();

    list.unshift(media);

    setLocalData(
      LOCAL_STORAGE_KEYS.MEDIA,
      list
    );
  }

  return media;
}

export async function deleteMedia(
  id: string
): Promise<void> {
  try {
    const docRef =
      doc(
        db,
        'media',
        id
      );

    await deleteDoc(
      docRef
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.DELETE,
      `media/${id}`
    );
  } finally {
    const list =
      await fetchMedia();

    const filtered =
      list.filter(
        m => m.id !== id
      );

    setLocalData(
      LOCAL_STORAGE_KEYS.MEDIA,
      filtered
    );
  }
}

// ----------------- TESTIMONIALS -----------------

export async function fetchTestimonials(): Promise<
  Testimonial[]
> {
  try {
    const q =
      query(
        collection(
          db,
          'testimonials'
        ),
        where(
          'isActive',
          '==',
          true
        )
      );

    const snap =
      await withTimeout(
        getDocs(q),
        3000
      );

    if (!snap.empty) {
      const list =
        snap.docs.map(
          d =>
            ({
              ...d.data(),
              id: d.id
            } as Testimonial)
        );

      setLocalData(
        LOCAL_STORAGE_KEYS.TESTIMONIALS,
        list
      );

      return list;
    }
  } catch (err) {
    console.warn(
      'Testimonials query notice:',
      err
    );
  }

  const cached =
    getLocalData<Testimonial[]>(
      LOCAL_STORAGE_KEYS.TESTIMONIALS,
      INITIAL_TESTIMONIALS
    );

  return cached.filter(
    testimonial =>
      testimonial.isActive === true
  );
}

export async function saveTestimonial(
  testimonial: Testimonial
): Promise<void> {
  const id =
    testimonial.id ||
    `test-${Date.now()}`;

  const data = {
    ...testimonial,
    id
  };

  try {
    const docRef =
      doc(
        db,
        'testimonials',
        id
      );

    await setDoc(
      docRef,
      data,
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.WRITE,
      `testimonials/${id}`
    );
  } finally {
    const list =
      getLocalData<Testimonial[]>(
        LOCAL_STORAGE_KEYS.TESTIMONIALS,
        INITIAL_TESTIMONIALS
      );

    const idx =
      list.findIndex(
        t => t.id === id
      );

    if (idx >= 0) {
      list[idx] = data;
    } else {
      list.unshift(data);
    }

    setLocalData(
      LOCAL_STORAGE_KEYS.TESTIMONIALS,
      list
    );
  }
}

export async function deleteTestimonial(
  id: string
): Promise<void> {
  try {
    const docRef =
      doc(
        db,
        'testimonials',
        id
      );

    await deleteDoc(
      docRef
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.DELETE,
      `testimonials/${id}`
    );
  } finally {
    const list =
      getLocalData<Testimonial[]>(
        LOCAL_STORAGE_KEYS.TESTIMONIALS,
        INITIAL_TESTIMONIALS
      );

    setLocalData(
      LOCAL_STORAGE_KEYS.TESTIMONIALS,
      list.filter(
        t => t.id !== id
      )
    );
  }
}

// ----------------- SITE SETTINGS -----------------

export async function fetchSiteSettings(): Promise<
  SiteSettings
> {
  try {
    const docRef =
      doc(
        db,
        'siteSettings',
        'global'
      );

    const snap =
      await withTimeout(
        getDoc(docRef),
        3000
      );

    if (snap.exists()) {
      const data =
        snap.data() as SiteSettings;

      const merged: SiteSettings = {
        ...INITIAL_SITE_SETTINGS,
        ...data,
        businessEmail:
          'kingsmancorporation@gmail.com',
        supportEmail:
          'kingsmancorporation@gmail.com',
        phone:
          '+91 87239 45876',
        businessAddress:
          'Office No, 312, Swami Vivekanand Rd, Machi Market, Appa Pada, Malad East, Mumbai, Maharashtra 400102',
        heroFallbackImg:
          data.heroFallbackImg &&
          !data.heroFallbackImg.includes(
            'unsplash'
          )
            ? data.heroFallbackImg
            : '/src/assets/images/hero_indian_married_woman_1790523916791.jpg'
      };

      setLocalData(
        LOCAL_STORAGE_KEYS.SETTINGS,
        merged
      );

      return merged;
    }
  } catch (err) {
    console.warn(
      'Site settings query notice:',
      err
    );
  }

  return getLocalData<SiteSettings>(
    LOCAL_STORAGE_KEYS.SETTINGS,
    INITIAL_SITE_SETTINGS
  );
}

export async function saveSiteSettings(
  settings: SiteSettings
): Promise<void> {
  try {
    const docRef =
      doc(
        db,
        'siteSettings',
        'global'
      );

    await setDoc(
      docRef,
      settings,
      { merge: true }
    );
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.WRITE,
      'siteSettings/global'
    );
  } finally {
    setLocalData(
      LOCAL_STORAGE_KEYS.SETTINGS,
      settings
    );
  }
}
