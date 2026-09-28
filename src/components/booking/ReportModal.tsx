import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitReport } from '../../services/firebaseService';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  targetId: string;
  targetName: string;
  reportedType: 'profile' | 'message' | 'other';
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  targetId,
  targetName,
  reportedType,
  isOpen,
  onClose
}) => {
  const { userAccount } = useAuth();
  const [reason, setReason] = useState('Inappropriate conduct or violation of guidelines');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAccount) {
      setErrorMsg('Please log in to submit a safety report.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await submitReport({
        reporterId: userAccount.uid,
        reportedType,
        targetId,
        targetName,
        reason,
        details
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-[#0d0d12] border border-rose-900/40 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#14141c]">
          <div className="flex items-center gap-2 text-rose-400 font-medium text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>Confidential Safety Report</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#dfb76c] mx-auto" />
              <h4 className="text-xl font-display text-white">Report Logged</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Thank you for upholding community integrity. Kingsman Corporation administrators will review this report within 12 hours and initiate moderation procedures.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2 rounded gold-btn-outline text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-xs text-neutral-400 block mb-1">Target Resource:</span>
                <span className="text-sm font-medium text-white bg-[#181824] px-3 py-1.5 rounded block border border-white/5">
                  {targetName} ({reportedType})
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                  Primary Reason *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Inappropriate conduct or violation of guidelines">Inappropriate conduct / policy violation</option>
                  <option value="Attempted solicitation of unlawful services">Attempted solicitation of unlawful / sexual services</option>
                  <option value="Harassment, disrespect, or boundary violation">Harassment or boundary violation</option>
                  <option value="Misrepresentation or inaccurate details">Misrepresentation or inaccurate details</option>
                  <option value="Other safety concern">Other safety concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                  Specific Details & Context *
                </label>
                <textarea
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide precise details to assist admin investigation..."
                  className="w-full bg-[#161622] border border-white/10 focus:border-[#dfb76c] rounded px-3 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-[#181822] text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 text-xs uppercase tracking-wider font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Filing Report...' : 'File Confidential Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
