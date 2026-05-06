import { useAppStore } from '../../store/appStore'
import Pagination from '../../components/ui/Pagination'
import { CheckCircle2, AlertCircle, Info, Trash2, MailOpen, Package, Send, DollarSign } from 'lucide-react'
import { Button } from '../../components/ui/FormComponents'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead, fetchNotifications } = useAppStore()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadData = async (pageNumber = 1) => {
    const data = await fetchNotifications(pageNumber, 50)
    if (data && !Array.isArray(data)) {
      setTotalPages(data.totalPages || 1)
    }
  }

  useEffect(() => {
    loadData(page)
  }, [page])

  const iconMap = {
    system: <CheckCircle2 className="w-5 h-5 text-[#4A3A5C]" />,
    listing: <Package className="w-5 h-5 text-[#4A3A5C]" />,
    request: <Send className="w-5 h-5 text-[#4A3A5C]" />,
    deal: <DollarSign className="w-5 h-5 text-[#4A3A5C]" />,
    info: <Info className="w-5 h-5 text-[#4A3A5C]" />,
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Notifications</h1>
          <p className="text-[#666666]">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              markAllRead()
              toast.success('All notifications marked as read')
            }}
          >
            Mark all as read
          </Button>
        )}
      </motion.div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif, idx) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex gap-4 p-4 rounded-lg border transition ${
                notif.is_read
                  ? 'bg-[#F9F9FB] border-[#E5E5E5]'
                  : 'bg-white border-[#4A3A5C]/20 ring-1 ring-inset ring-[#4A3A5C]/10'
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {iconMap[notif.type] || iconMap.info}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-[#1A1A1A]">{notif.title}</h4>
                  <span className="text-xs text-[#999999] flex-shrink-0">
                    {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                <p className="text-sm text-[#666666]">{notif.message}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notif.is_read && (
                  <button
                    onClick={() => {
                      markRead(notif.id)
                      toast.success('Marked as read')
                    }}
                    className="p-1.5 hover:bg-[#F3F1F7] rounded-lg transition text-[#999999] hover:text-[#4A3A5C]"
                    title="Mark as read"
                  >
                    <MailOpen className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => toast.success('Notification deleted')}
                  className="p-1.5 hover:bg-[#F3F1F7] rounded-lg transition text-[#999999] hover:text-[#4A3A5C]"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-[#F3F1F7] border-2 border-dashed border-[#E5E5E5] rounded-xl"
        >
          <CheckCircle2 className="w-12 h-12 text-[#4A3A5C] mb-4 opacity-50" />
          <p className="text-[#1A1A1A] mb-1">No notifications yet</p>
          <p className="text-[#666666] text-sm">You'll receive notifications here when there are updates on your listings and requests</p>
        </motion.div>
      )}
    </div>
  )
}
