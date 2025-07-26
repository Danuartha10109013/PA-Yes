// resources/js/Components/Tabel/TableRowUser.tsx
import React from 'react';
import ActionMenuUser from './ActionMenuUser';
import { User as UserType } from '@/components/Types/types';

type TableRowUserProps = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'sales';
    created_at: string;
    updated_at: string;
    onEdit: (user: UserType) => void;
    onDelete: (user: UserType) => void;
};

const TableRowUser: React.FC<TableRowUserProps> = ({
    id,
    name,
    email,
    role,
    created_at,
    updated_at,
    onEdit,
    onDelete,
}) => {
    // Construct the full UserType object to pass to handlers and ActionMenuUser
    const userFull: UserType = {
        id,
        name,
        email,
        role,
        created_at,
        updated_at,
        email_verified_at: null,
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'sales':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <tr className="bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200">
            <td className="pl-6 py-4">
                <div className="font-semibold text-[#344767] text-sm">{name}</div>
            </td>
            <td className="py-4">
                <div className="text-sm text-gray-600">{email}</div>
            </td>
            <td className="py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(role)}`}>
                    {role}
                </span>
            </td>
            <td className="py-4">
                <div className="text-xs text-gray-500">{formatDate(created_at)}</div>
            </td>
            <td className="py-4">
                <div className="text-xs text-gray-500">{formatDate(updated_at)}</div>
            </td>
            <td className="relative py-4 pr-6 text-right">
                <ActionMenuUser
                    user={userFull}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </td>
        </tr>
    );
};

export default TableRowUser;
