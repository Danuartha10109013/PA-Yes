// import Checkbox from '@/components/Checkbox';
// import InputError from '@/components/InputError';
// import InputLabel from '@/components/InputLabel';
// import PrimaryButton from '@/components/PrimaryButton';
// import TextInput from '@/components/TextInput';
// // import GuestLayout from '@/layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';
// import { FormEventHandler } from 'react';

// export default function Login({
//     status,
//     canResetPassword,
// }: {
//     status?: string;
//     canResetPassword: boolean;
// }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false as boolean,
//     });

//     const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//         <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 dark:bg-gray-900 font-sans text-gray-900 antialiased">
//             {children}
//         </div>
//     );

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();

//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Login Page" />

//             {status && (
//                 <div className="mb-4 text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}

//             {/* Changed max-w-6xl to max-w-4xl for a smaller layout */}
//             <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
//                 <div className="md:w-1/2">
//                     {/* <img
//                         src="/assets/image/logo.png"
//                         alt="Night sky with stars over snow-covered mountain landscape and dark forest below"
//                         className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
//                         height={600}
//                         width={600}
//                     /> */}
//                     <img
//                         src="/assets/image/logo.png"
//                         alt="Logo"
//                         className="w-full h-full object-center object-contain p-4"
//                     />

//                 </div>
//                 {/* <div className="md:w-1/2  background: linear-gradient(90deg, #e5ecff 0%, #b6bfdb 100%) p-10 rounded-b-xl md:rounded-r-xl md:rounded-bl-none flex flex-col justify-center"> */}
//                 <div
//                     className="md:w-1/2 p-10 rounded-b-xl md:rounded-r-xl md:rounded-bl-none flex flex-col justify-center"
//                     style={{
//                         background: 'linear-gradient(90deg, #e5ecff 0%, #b6bfdb 100%)',
//                     }}
//                 >

//                     <h3 className="text-black text-lg font-semibold mb-2">Login</h3>
//                     <p className="text-xs mb-6">Silahkan Login</p>

//                     <form onSubmit={submit} className="space-y-4">
//                         <div>
//                             <InputLabel htmlFor="email" value="Email" />
//                             <TextInput
//                                 id="email"
//                                 type="email"
//                                 name="email"
//                                 value={data.email}
//                                 className="mt-1 block w-full"
//                                 autoComplete="username"
//                                 isFocused={true}
//                                 onChange={(e) => setData('email', e.target.value)}
//                                 placeholder="Email"
//                             />
//                             <InputError message={errors.email} className="mt-2" />
//                         </div>

//                         <div>
//                             <InputLabel htmlFor="password" value="Password" />
//                             <TextInput
//                                 id="password"
//                                 type="password"
//                                 name="password"
//                                 value={data.password}
//                                 className="mt-1 block w-full"
//                                 autoComplete="current-password"
//                                 onChange={(e) => setData('password', e.target.value)}
//                                 placeholder="Password"
//                             />
//                             <InputError message={errors.password} className="mt-2" />
//                         </div>

//                         <div className="block">
//                             <label className="flex items-center text-xs space-x-2">
//                                 <Checkbox
//                                     name="remember"
//                                     checked={data.remember}
//                                     onChange={(e) => setData('remember', (e.target.checked || false))}
//                                 />
//                                 <span className="font-semibold text-black">Remember me</span>
//                             </label>
//                         </div>

//                         <div className="flex items-center justify-between mt-4">
//                             {canResetPassword && (
//                                 <Link
//                                     href={route('password.request')}
//                                     className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                                 >
//                                     Forgot your password?
//                                 </Link>
//                             )}

//                             <PrimaryButton className="ms-4" disabled={processing}>
//                                 Login Now
//                             </PrimaryButton>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </GuestLayout>
//     );
// }



import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput'; // Pastikan ini TextInput milikmu
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const GuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 dark:bg-gray-900 font-sans text-gray-900 antialiased">
        {children}
    </div>
);

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login - Tappp" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
            )}

            <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
                <div className="md:w-1/2">
                    <img
                        src="/assets/image/logo.png"
                        alt="Logo"
                        className="w-full h-full object-center object-contain p-4"
                    />
                </div>
                <div
                    className="md:w-1/2 p-10 rounded-b-xl md:rounded-r-xl md:rounded-bl-none flex flex-col justify-center"
                    style={{ background: 'linear-gradient(90deg, #e5ecff 0%, #b6bfdb 100%)' }}
                >
                    <h3 className="text-black text-lg font-semibold mb-2">Login</h3>
                    <p className="text-xs mb-6">Silahkan Login</p>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password dengan ikon mata yang sudah rapi */}
                        <div className="relative">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full pr-12 h-10" // pr-12 supaya ada ruang untuk icon, h-10 agar tinggi seragam
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                // className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-600 hover:text-gray-900"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-600 hover:text-gray-900 translate-y-3"

                                tabIndex={-1}
                                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M10 3c-4.418 0-8 4-8 7s3.582 7 8 7 8-4 8-7-3.582-7-8-7zM10 15c-2.761 0-5-2.462-5-5 0-2.538 2.239-5 5-5s5 2.462 5 5c0 2.538-2.239 5-5 5z" />
                                        <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M2.293 2.293a1 1 0 011.414 0l14 14a1 1 0 01-1.414 1.414l-2.47-2.47A7.963 7.963 0 0110 17c-4.418 0-8-4-8-7a7.995 7.995 0 012.293-5.707L2.293 3.707a1 1 0 010-1.414zM10 5c2.761 0 5 2.462 5 5 0 .63-.137 1.233-.38 1.78l-1.715-1.715a3 3 0 00-4.19-4.19L8.22 5.38A4.978 4.978 0 0110 5z" />
                                    </svg>
                                )}
                            </button>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* <div className="block">
                            <label className="flex items-center text-xs space-x-2">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked || false)}
                                />
                                <span className="font-semibold text-black">Remember me</span>
                            </label>
                        </div> */}

                        <div className="flex items-center justify-between mt-4">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Forgot your password?
                                </Link>
                            )}

                            <PrimaryButton className="ms-4" disabled={processing}>
                                Login Now
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
