import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, XCircle, ShieldAlert, FileText, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import Loading from "../components/Loading";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionConfirm, setActionConfirm] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/reports");
      setReports(res.data);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionConfirm) return;
    const { action, reportId } = actionConfirm;

    try {
      if (action === "dismiss") {
        await api.put(`/admin/reports/${reportId}/dismiss`);
        setReports(reports.map(r => r._id === reportId ? { ...r, status: "dismissed" } : r));
        toast.success("Report dismissed");
      } else if (action === "warn") {
        await api.put(`/admin/reports/${reportId}/warn`);
        setReports(reports.map(r => r._id === reportId ? { ...r, status: "resolved" } : r));
        toast.success("User warned successfully");
      } else if (action === "ban") {
        await api.put(`/admin/reports/${reportId}/ban`);
        setReports(reports.map(r => r._id === reportId ? { ...r, status: "resolved" } : r));
        toast.success("User permanently banned");
      } else if (action === "delete") {
        await api.delete(`/admin/reports/${reportId}/idea`);
        setReports(reports.map(r => r._id === reportId ? { ...r, status: "resolved" } : r));
        toast.success("Idea deleted and report resolved");
      }
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setActionConfirm(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <ShieldAlert className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Reports</h1>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All clear!</h3>
            <p className="text-gray-500 dark:text-gray-400">There are no pending reports to review.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div 
                key={report._id} 
                className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border ${report.status === 'pending' ? 'border-red-200 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-600'}`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            report.status === 'pending' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            report.status === 'dismissed' ? 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {report.status}
                          </span>
                          <span className="text-sm font-medium text-gray-500">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          {report.reason}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{report.additionalInfo || "No additional information provided."}</p>
                      
                      {report.photoUrl && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Evidence Attached
                          </p>
                          <a href={report.photoUrl} target="_blank" rel="noopener noreferrer">
                            <img src={report.photoUrl} alt="Evidence" className="max-w-xs rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:opacity-90 transition-opacity" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-80 bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reported Idea</p>
                        <p className="font-medium text-gray-900 dark:text-white truncate" title={report.idea?.title}>
                          {report.idea ? report.idea.title : <span className="text-red-500 italic">Idea Deleted</span>}
                        </p>
                        {report.idea && <p className="text-sm text-gray-500 mt-1">Author: {report.idea.author?.name} ({report.idea.author?.email})</p>}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reported By</p>
                        <p className="font-medium text-gray-900 dark:text-white">{report.reporter?.name}</p>
                        <p className="text-sm text-gray-500">{report.reporter?.email}</p>
                      </div>
                    </div>

                    {report.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                          onClick={() => setActionConfirm({ action: 'dismiss', reportId: report._id })}
                          className="col-span-2 py-2 px-3 rounded-lg font-medium text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" /> Dismiss Report
                        </button>
                        
                        {report.idea && (
                          <>
                            <button
                              onClick={() => setActionConfirm({ action: 'warn', reportId: report._id })}
                              className="py-2 px-3 rounded-lg font-medium text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-400 transition-colors"
                            >
                              Warn User
                            </button>
                            <button
                              onClick={() => setActionConfirm({ action: 'ban', reportId: report._id })}
                              className="py-2 px-3 rounded-lg font-medium text-sm bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 transition-colors"
                            >
                              Ban User
                            </button>
                            <button
                              onClick={() => setActionConfirm({ action: 'delete', reportId: report._id })}
                              className="col-span-2 py-2 px-3 rounded-lg font-medium text-sm border-2 border-red-500 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 mt-1"
                            >
                              <Trash2 className="w-4 h-4" /> Delete Idea
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {actionConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Action</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {actionConfirm.action === 'dismiss' && "Are you sure you want to dismiss this report?"}
                {actionConfirm.action === 'warn' && "This will block the user from posting ideas for 3 days."}
                {actionConfirm.action === 'ban' && "This will permanently ban the user from posting ideas."}
                {actionConfirm.action === 'delete' && "This will delete the reported idea and all its comments."}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleAction}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setActionConfirm(null)}
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
