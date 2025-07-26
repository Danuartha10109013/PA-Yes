import '../css/app.css';
// import '../../bootstrap';


import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { usePage } from '@inertiajs/react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
// const { props } = usePage();

//     console.log('PROPS:', props); // <--- TAMBAHKAN INI

//     const user = props.auth?.user;

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});


// import '../css/app.css';
// import { createInertiaApp } from '@inertiajs/react';
// import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
// import { createRoot } from 'react-dom/client';
// import MainLayout from './Layout/MainLayout';

// const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// createInertiaApp({
//     title: (title) => `${title} - ${appName}`,
//     resolve: (name) =>
//         resolvePageComponent(
//             `./pages/${name}.tsx`,
//             import.meta.glob('./pages/**/*.tsx'),
//         ),
//     setup({ el, App, props }) {
//         const root = createRoot(el);

//         // Override default App to inject layout
//         const SetupApp = () => {
//             const Page = props.initialComponent as any;
//             const Layout = Page.layout || ((page: React.ReactNode) => <MainLayout>{page}</MainLayout>);

//             return Layout(<App {...props} />);
//         };

//         root.render(<SetupApp />);
//     },
//     progress: {
//         color: '#4B5563',
//     },
// });

