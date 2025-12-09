'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";
import { IoClose, IoCheckmarkCircle, IoWarning, IoInformationCircle, IoCloseCircle } from "react-icons/io5";
import gsap from "gsap";

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    duration?: number;
}

interface NotificationContextType {
    showNotification: (notification: Omit<Notification, 'id'>) => void;
    hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification: Notification = {
            ...notification,
            id,
            duration: notification.duration ?? 4000
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto remove after duration
        if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
                hideNotification(id);
            }, newNotification.duration);
        }
    }, []);

    const hideNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            <NotificationContainer notifications={notifications} onClose={hideNotification} />
        </NotificationContext.Provider>
    );
}

interface NotificationContainerProps {
    notifications: Notification[];
    onClose: (id: string) => void;
}

function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
    return (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 flex flex-col gap-3 md:max-w-[400px] md:w-full pointer-events-none">
            {notifications.map(notification => (
                <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                    onClose={() => onClose(notification.id)} 
                />
            ))}
        </div>
    );
}

interface NotificationCardProps {
    notification: Notification;
    onClose: () => void;
}

function NotificationCard({ notification, onClose }: NotificationCardProps) {
    const { type, title, message, duration = 4000 } = notification;
    const cardRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        const progress = progressRef.current;
        const icon = iconRef.current;

        if (!card) return;

        // Set initial state
        gsap.set(card, {
            opacity: 0,
            y: -20,
            scale: 0.9,
        });

        // Entrance animation timeline
        const tl = gsap.timeline();

        tl.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
        });

        // Icon bounce
        if (icon) {
            tl.fromTo(icon, 
                { scale: 0, rotation: -180 },
                { scale: 1, rotation: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" },
                "-=0.2"
            );
        }

        // Progress bar animation
        if (progress && duration > 0) {
            gsap.fromTo(progress,
                { scaleX: 1 },
                { 
                    scaleX: 0, 
                    duration: duration / 1000,
                    ease: "linear",
                    onComplete: handleClose
                }
            );
        }

        return () => {
            tl.kill();
        };
    }, []);

    const handleClose = () => {
        const card = cardRef.current;
        if (!card) {
            onClose();
            return;
        }

        // Exit animation
        gsap.to(card, {
            opacity: 0,
            x: 100,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.in",
            onComplete: onClose
        });
    };

    const handleCloseHover = (isHovering: boolean) => {
        if (closeButtonRef.current) {
            gsap.to(closeButtonRef.current, {
                rotation: isHovering ? 90 : 0,
                scale: isHovering ? 1.1 : 1,
                duration: 0.2,
                ease: "power2.out"
            });
        }
    };

    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: <IoCheckmarkCircle className="text-green-500" size={24} />,
            titleColor: 'text-green-800',
            messageColor: 'text-green-600',
            progressColor: 'bg-green-500'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            icon: <IoCloseCircle className="text-red-500" size={24} />,
            titleColor: 'text-red-800',
            messageColor: 'text-red-600',
            progressColor: 'bg-red-500'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            icon: <IoWarning className="text-yellow-500" size={24} />,
            titleColor: 'text-yellow-800',
            messageColor: 'text-yellow-600',
            progressColor: 'bg-yellow-500'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: <IoInformationCircle className="text-blue-500" size={24} />,
            titleColor: 'text-blue-800',
            messageColor: 'text-blue-600',
            progressColor: 'bg-blue-500'
        }
    };

    const style = styles[type];

    return (
        <div 
            ref={cardRef}
            className={`${style.bg} ${style.border} border rounded-xl shadow-lg pointer-events-auto overflow-hidden`}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div ref={iconRef} className="flex-shrink-0 mt-0.5">
                        {style.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm ${style.titleColor}`}>
                            {title}
                        </h4>
                        {message && (
                            <p className={`text-sm mt-1 ${style.messageColor}`}>
                                {message}
                            </p>
                        )}
                    </div>

                    {/* Close Button */}
                    <button 
                        ref={closeButtonRef}
                        onClick={handleClose}
                        onMouseEnter={() => handleCloseHover(true)}
                        onMouseLeave={() => handleCloseHover(false)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            {duration > 0 && (
                <div className="h-1 w-full bg-gray-200/50">
                    <div 
                        ref={progressRef}
                        className={`h-full ${style.progressColor} origin-left`}
                    />
                </div>
            )}
        </div>
    );
}

// Helper hook for common notifications
export function useNotifications() {
    const { showNotification } = useNotification();

    return {
        success: (title: string, message?: string) => 
            showNotification({ type: 'success', title, message }),
        error: (title: string, message?: string) => 
            showNotification({ type: 'error', title, message }),
        warning: (title: string, message?: string) => 
            showNotification({ type: 'warning', title, message }),
        info: (title: string, message?: string) => 
            showNotification({ type: 'info', title, message }),
    };
}
