// import React, { useRef, useEffect, useCallback, MouseEvent } from 'react';
// import styles from './Drawer.module.css';

// // Tipe untuk props Drawer
// interface DrawerProps {
//   isOpen: boolean; // Menentukan apakah drawer terbuka atau tertutup
//   onClose: () => void; // Fungsi callback ketika drawer ditutup
//   children: React.ReactNode; // Konten yang akan ditampilkan di dalam drawer
//   position?: 'left' | 'right' | 'top' | 'bottom'; // Posisi drawer (default: 'right')
//   width?: string; // Lebar drawer (contoh: '300px', '50%', 'auto')
//   height?: string; // Tinggi drawer (khusus untuk position 'top'/'bottom', contoh: '300px', '50%', 'auto')
//   className?: string; // Kelas CSS tambahan untuk drawer
//   overlayClassName?: string; // Kelas CSS tambahan untuk overlay
//   disableOverlayClick?: boolean; // Menonaktifkan penutupan drawer saat klik overlay
// }

// const Drawer: React.FC<DrawerProps> = ({
//   isOpen,
//   onClose,
//   children,
//   position = 'right',
//   width,
//   height,
//   className,
//   overlayClassName,
//   disableOverlayClick = false,
// }) => {
//   const drawerRef = useRef<HTMLDivElement>(null);

//   // Menangani penutupan drawer saat menekan tombol Escape
//   const handleEscapeKey = useCallback(
//     (event: KeyboardEvent) => {
//       if (event.key === 'Escape' && isOpen) {
//         onClose();
//       }
//     },
//     [isOpen, onClose]
//   );

//   // Menangani klik di luar drawer (overlay)
//   const handleOverlayClick = useCallback(
//     (event: MouseEvent<HTMLDivElement>) => {
//       if (disableOverlayClick) return; // Jangan tutup jika disableOverlayClick true

//       if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     },
//     [onClose, disableOverlayClick]
//   );

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden'; // Mencegah scrolling body saat drawer terbuka
//       document.addEventListener('keydown', handleEscapeKey);
//     } else {
//       document.body.style.overflow = ''; // Mengembalikan scrolling body
//       document.removeEventListener('keydown', handleEscapeKey);
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscapeKey);
//       document.body.style.overflow = ''; // Pastikan overflow direset saat komponen unmount
//     };
//   }, [isOpen, handleEscapeKey]);

//   if (!isOpen) {
//     return null; // Tidak render apa-apa jika drawer tertutup
//   }

//   // Menentukan gaya drawer berdasarkan posisi
//   const drawerStyle: React.CSSProperties = {};
//   if (position === 'left' || position === 'right') {
//     drawerStyle.width = width || '300px'; // Default width untuk left/right
//   } else {
//     drawerStyle.height = height || '300px'; // Default height untuk top/bottom
//   }

//   return (
//     <div
//       className={`${styles.overlay} ${overlayClassName || ''}`}
//       onClick={handleOverlayClick}
//     >
//       <div
//         ref={drawerRef}
//         className={`${styles.drawer} ${styles[position]} ${className || ''}`}
//         style={drawerStyle}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Drawer;

// Drawer.tsx
// import React, { useRef, useEffect, useCallback, useState, MouseEvent } from 'react';
// import styles from './Drawer.module.css';

// interface DrawerProps {
//     isOpen: boolean;
//     onClose: () => void;
//     children: React.ReactNode;
//     position?: 'left' | 'right' | 'top' | 'bottom';
//     width?: string;
//     height?: string;
//     className?: string;
//     overlayClassName?: string;
//     disableOverlayClick?: boolean;
// }

// const Drawer: React.FC<DrawerProps> = ({
//     isOpen,
//     onClose,
//     children,
//     position = 'right',
//     width,
//     height,
//     className,
//     overlayClassName,
//     disableOverlayClick = false,
// }) => {
//     const drawerRef = useRef<HTMLDivElement>(null);
//     const [shouldRender, setShouldRender] = useState(isOpen);

//     useEffect(() => {
//         if (isOpen) {
//             setShouldRender(true);
//         } else {
//             const timeoutId = setTimeout(() => setShouldRender(false), 300);
//             return () => clearTimeout(timeoutId);
//         }
//     }, [isOpen]);

//     const handleEscapeKey = useCallback(
//         (event: KeyboardEvent) => {
//             if (event.key === 'Escape' && isOpen) {
//                 onClose();
//             }
//         },
//         [isOpen, onClose]
//     );

//     const handleOverlayClick = useCallback(
//         (event: MouseEvent<HTMLDivElement>) => {
//             if (disableOverlayClick) return;

//             if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
//                 onClose();
//             }
//         },
//         [onClose, disableOverlayClick]
//     );

//     useEffect(() => {
//         if (isOpen) {
//             document.body.style.overflow = 'hidden';
//             document.addEventListener('keydown', handleEscapeKey);
//         } else {
//             document.body.style.overflow = '';
//             document.removeEventListener('keydown', handleEscapeKey);
//         }
//         return () => {
//             document.removeEventListener('keydown', handleEscapeKey);
//             document.body.style.overflow = '';
//         };
//     }, [isOpen, handleEscapeKey]);

//     if (!shouldRender) return null;

//     const drawerStyle: React.CSSProperties = {};
//     if (position === 'left' || position === 'right') {
//         drawerStyle.width = width || '300px';
//     } else {
//         drawerStyle.height = height || '300px';
//     }

//     return (
//         <div
//             className={`${styles.overlay} ${overlayClassName || ''} ${isOpen ? styles.open : styles.closed}`}
//             onClick={handleOverlayClick}
//         >
//             <div
//                 ref={drawerRef}
//                 className={`${styles.drawer} ${styles[position]} ${className || ''} ${isOpen ? styles.open : styles.closed}`}
//                 style={drawerStyle}
//             >
//                 {children}
//             </div>
//         </div>
//     );
// };

// export default Drawer;


import React, { useRef, useEffect, useCallback, useState, MouseEvent } from 'react';
import styles from './Drawer.module.css';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    position?: 'left' | 'right' | 'top' | 'bottom';
    width?: string;
    height?: string;
    className?: string;
    overlayClassName?: string;
    disableOverlayClick?: boolean;
}

const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    children,
    position = 'right',
    width,
    height,
    className,
    overlayClassName,
    disableOverlayClick = false,
}) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        } else {
            const timeoutId = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen]);

    const handleEscapeKey = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        },
        [isOpen, onClose]
    );

    const handleOverlayClick = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if (disableOverlayClick) return;

            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                onClose();
            }
        },
        [onClose, disableOverlayClick]
    );

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscapeKey);
        }
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleEscapeKey]);

    if (!shouldRender) return null;

    const drawerStyle: React.CSSProperties = {};
    if (position === 'left' || position === 'right') {
        drawerStyle.width = width || '300px';
    } else {
        drawerStyle.height = height || '300px';
    }

    return (
        <div
            className={`${styles.overlay} ${overlayClassName || ''} ${isOpen ? styles.open : styles.closed}`}
            onClick={handleOverlayClick}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={drawerRef}
                className={`${styles.drawer} ${styles[position]} ${className || ''} ${isOpen ? styles.open : ''}`}
                style={drawerStyle}
            >
                {children}
            </div>
        </div>
    );
};

export default Drawer;
