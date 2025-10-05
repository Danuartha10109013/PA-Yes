// BoardView.tsx
import LeadColumn from '@/components/Leads/KanbanColumn';
import { ColumnData, ContactOption, LeadDatas, ProductOption } from '@/components/Leads/types';
import { Head, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import MySidebar from '../../Layout/Sidebar';
import AddLeadModal from './addlead';
import BoardHeader from './boardheader';
import DeleteLeadModal from './deletelead';
import EditColumnModal from './EditColumnModal';

// Helper function untuk safe JSON parsing
const safeJsonParse = (str: string | null | undefined) => {
    if (!str) return null;
    try {
        return JSON.parse(str);
    } catch (e) {
        console.warn('Failed to parse JSON:', str);
        return null;
    }
};

const BoardView: React.FC = () => {
    const {
        kanbanData,
        contacts: contactsFromPage = [], // Rename to avoid conflict with state
        products: productsFromPage = [], // Rename to avoid conflict with state
        errors,
        success,
    } = usePage().props;

    const [contacts, setContacts] = useState<ContactOption[]>([]);
    const [products, setProducts] = useState<ProductOption[]>([]);

    useEffect(() => {
        console.log('✅ BoardView - contactsFromPage:', contactsFromPage);
        console.log('✅ BoardView - productsFromPage:', productsFromPage);
        setContacts(contactsFromPage as ContactOption[]);
        setProducts(productsFromPage as ProductOption[]);
    }, [contactsFromPage, productsFromPage]);

    const [columns, setColumns] = useState<ColumnData[]>([]);
    const [leads, setLeads] = useState<LeadDatas[]>([]);
    const [draggedLead, setDraggedLead] = useState<LeadDatas | null>(null);
    const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState<LeadDatas | null>(null);

    // State untuk AddLeadModal utama di BoardView
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const [addLeadInitialColumnId, setAddLeadInitialColumnId] = useState<string>('');

    // (Removed) AddColumnModal state
    // State untuk EditColumnModal
    const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false);
    const [columnToEdit, setColumnToEdit] = useState<ColumnData | null>(null);

    // State untuk menentukan view yang aktif
    const { url } = usePage();
    const getCurrentViewTitle = () => {
        if (url.includes('/list/leads')) {
            if (url.includes('show=arsip')) {
                if (url.includes('filter=dealing')) {
                    return 'Dealing Leads - Tappp';
                } else if (url.includes('filter=junk')) {
                    return 'Junk Leads - Tappp';
                } else {
                    return 'Archive Leads - Tappp';
                }
            } else {
                return 'List Leads - Tappp';
            }
        } else if (url.includes('/kanban/leads')) {
            return 'Kanban Board - Tappp';
        }
        return 'Leads - Tappp';
    };

    const getCurrentViewBreadcrumb = () => {
        if (url.includes('/list/leads')) {
            if (url.includes('show=arsip')) {
                if (url.includes('filter=dealing')) {
                    return 'Dealing';
                } else if (url.includes('filter=junk')) {
                    return 'Junk';
                } else {
                    return 'Arsip';
                }
            } else {
                return 'List';
            }
        } else if (url.includes('/kanban/leads')) {
            return 'Board';
        }
        return 'Board';
    };

    const getCurrentViewUrl = () => {
        if (url.includes('/list/leads')) {
            if (url.includes('show=arsip')) {
                if (url.includes('filter=dealing')) {
                    return '/kanban/leads?filter=dealing';
                } else if (url.includes('filter=junk')) {
                    return '/kanban/leads?filter=junk';
                } else {
                    return '/kanban/arsip';
                }
            } else {
                return '/kanban/list';
            }
        } else if (url.includes('/kanban/leads')) {
            return '/kanban';
        }
        return '/kanban';
    };

    useEffect(() => {
        if (errors?.message) {
            const msg = typeof errors.message === 'string' ? errors.message : '';
            Swal.fire({ icon: 'error', title: 'Gagal!', text: msg });
        } else if (success) {
            const msg = typeof success === 'string' ? success : '';
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: msg, timer: 2000, showConfirmButton: false });
        }
    }, [errors, success]);

    useEffect(() => {
        if (kanbanData && Array.isArray(kanbanData)) {
            console.log('✅ Processing kanbanData:', kanbanData);
            console.log(
                '🔍 DEALING column data:',
                kanbanData.find((col) => col.title === 'DEALING'),
            );

            setColumns(
                kanbanData.map((col: any) => ({
                    id: col.id,
                    title: col.title,
                    bgColor: col.bgColor || 'bg-gray-100',
                    borderColor: col.borderColor || 'border-gray-300',
                    titleColor: col.titleColor || 'text-gray-600',
                    dotBorderColor: col.dotBorderColor || 'border-gray-400',
                    dotBgColor: col.dotBgColor || 'bg-transparent',
                    dotTextColor: col.dotTextColor || 'text-gray-400',
                    addLeadColor: col.addLeadColor || 'text-gray-700',
                })),
            );

            const allLeads: LeadDatas[] = kanbanData.flatMap((col: any) => {
                console.log(`✅ Processing column ${col.title}:`, col.leads);
                if (col.title === 'DEALING') {
                    console.log('🔍 DEALING column leads count:', col.leads.length);
                    console.log('🔍 DEALING column leads:', col.leads);
                }
                return col.leads.map((lead: any) => ({
                    ...lead,
                    columnId: lead.columnId || col.id,

                    // ✅ Perbaikan: parse jika bentuk string JSON
                    social_media:
                        typeof lead.social_media === 'string' ? (safeJsonParse(lead.social_media) ?? lead.social_media) : (lead.social_media ?? null),

                    address: typeof lead.address === 'string' ? (safeJsonParse(lead.address) ?? lead.address) : (lead.address ?? null),
                }));
            });

            console.log('✅ Final allLeads:', allLeads);
            setLeads(allLeads);
        } else {
            console.warn('⚠️ kanbanData is not available or not an array:', kanbanData);
        }
    }, [kanbanData]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, lead: LeadDatas) => {
        setDraggedLead(lead);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => setDraggedLead(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
        e.preventDefault();
        setDragOverColumnId(columnId);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
            setDragOverColumnId(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
        e.preventDefault();
        setDragOverColumnId(null);

        if (!draggedLead || draggedLead.columnId === targetColumnId) return;

        const originalLead = draggedLead;

        setLeads((prev) => prev.map((lead) => (lead.id === originalLead.id ? { ...lead, columnId: targetColumnId } : lead)));

        router.put(
            '/kanban/leads/update-column',
            {
                leadId: originalLead.id,
                newColumnId: targetColumnId,
            },
            {
                onSuccess: () => {
                    Swal.fire({ icon: 'success', title: 'Lead dipindahkan!', timer: 1500, showConfirmButton: false });
                    // Refresh data from server to ensure consistency
                    router.reload({ only: ['kanbanData'] });
                    // Trigger refresh untuk Segmentasi Pasar
                    localStorage.setItem('segmentasi_needs_refresh', 'true');
                },
                onError: () => {
                    setLeads((prev) => prev.map((lead) => (lead.id === originalLead.id ? { ...lead, columnId: originalLead.columnId } : lead)));
                },
            },
        );
    };

    // Fungsi ini akan dipanggil oleh BoardHeader dan LeadColumn untuk membuka modal utama
    const openAddLeadModal = (columnId = '') => {
        setAddLeadInitialColumnId(columnId);
        setIsAddLeadModalOpen(true);
    };

    const handleCloseAddLeadModal = () => {
        setIsAddLeadModalOpen(false);
        setAddLeadInitialColumnId(''); // Reset kolom inisial saat modal ditutup
    };

    const handleSaveNewLead = (newLead: LeadDatas) => {
        setLeads((prev) => [...prev, newLead]);
        // Trigger refresh untuk Segmentasi Pasar
        localStorage.setItem('segmentasi_needs_refresh', 'true');
    };

    const handleDeleteLead = (lead: LeadDatas) => {
        setLeadToDelete(lead);
        setIsDeleteModalOpen(true);
    };

    // Column action handlers
    const handleEditColumn = (column: ColumnData) => {
        setColumnToEdit(column);
        setIsEditColumnModalOpen(true);
    };

    const handleCloseEditColumnModal = () => {
        setIsEditColumnModalOpen(false);
        setColumnToEdit(null);
    };

    const handleEditColumnSuccess = () => {
        router.reload({ only: ['kanbanData'] });
        // Trigger refresh untuk Segmentasi Pasar
        localStorage.setItem('segmentasi_needs_refresh', 'true');
    };

    const handleDuplicateColumn = (column: ColumnData) => {
        Swal.fire({
            title: 'Duplicate Column',
            text: `Are you sure you want to duplicate "${column.title}" column?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Duplicate',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    `/columns/${column.id}/duplicate`,
                    {},
                    {
                        onSuccess: () => {
                            Swal.fire('Success!', 'Column duplicated successfully.', 'success');
                            router.reload({ only: ['kanbanData'] });
                        },
                        onError: (errors) => {
                            Swal.fire('Error!', Object.values(errors).join(', '), 'error');
                        },
                    },
                );
            }
        });
    };

    // Archive/Delete column actions removed per request

    const handleDeleteModalConfirm = (leadId: string) => {
        router.delete(`/kanban/leads/${leadId}`, {
            onSuccess: () => {
                setLeads((prev) => prev.filter((l) => l.id !== leadId));
                Swal.fire({ icon: 'success', title: 'Lead dihapus!', timer: 1500, showConfirmButton: false });
            },
        });
        setIsDeleteModalOpen(false);
    };

    // (Removed) AddColumnModal handlers

    const filteredLeads = leads.filter((lead) => {
        if (!lead) return false;

        const name = lead.name ?? '';
        const companyName = lead.company_name ?? '';
        const trx = lead.trx ?? '';
        const productName = typeof lead.product === 'string' ? lead.product : ((lead as any).product?.name ?? '');

        return [name, companyName, trx, productName].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    // 1️⃣ Buat Set ID untuk kolom Junk & Dealing
    const junkDealingColumnIds = useMemo(() => {
        return new Set(
            columns
                .filter((c) => {
                    const title = (c.title || '').toString().trim().toUpperCase();
                    return title === 'JUNK' || title === 'DEALING';
                })
                .map((c) => c.id),
        );
    }, [columns]);

    // 2️⃣ Filter lead, jika kolomnya JUNK/DEALING maka cek tanggal updated_at
    const visibleLeads = useMemo(() => {
        const sevenDaysAgo = dayjs().subtract(7, 'day');

        return filteredLeads.filter((lead) => {
            const isJunkOrDealing = junkDealingColumnIds.has(lead.columnId);

            if (!isJunkOrDealing) {
                return true; // tampilkan semua non JUNK/DEALING
            }

            // Jika lead dari kolom JUNK/DEALING → cek tanggal updated_at
            const updatedAt = lead.updated_at ? dayjs(lead.updated_at) : null;

            // Tampilkan jika masih dalam 7 hari terakhir
            if (updatedAt && updatedAt.isAfter(sevenDaysAgo, 'day')) {
                return true;
            }

            // Kalau sudah lewat 7 hari, jangan tampilkan
            return false;
        });
    }, [filteredLeads, junkDealingColumnIds]);

    return (
        <>
            <Head title={getCurrentViewTitle()} />
            <div className="flex h-screen overflow-hidden">
                <MySidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <BoardHeader
                        onSave={handleSaveNewLead}
                        searchTerm={searchTerm}
                        onSearchChange={(e) => setSearchTerm(e.target.value)}
                        contacts={contacts}
                        products={products}
                        columns={columns.map((c) => ({ id: c.id, name: c.title }))}
                    />
                    <div className="flex space-x-4 overflow-x-auto p-3">
                        {columns.map((column) => {
                            const columnLeads = visibleLeads.filter((l) => l.columnId === column.id);
                            return (
                                <LeadColumn
                                    key={column.id}
                                    column={column}
                                    leads={columnLeads}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    isDragOver={dragOverColumnId === column.id}
                                    onAddLead={() => openAddLeadModal(column.id)}
                                    onEditLeadSuccess={(updated) => setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))}
                                    onDeleteLead={handleDeleteLead}
                                    contacts={contacts}
                                    products={products}
                                    onEditColumn={handleEditColumn}
                                />
                            );
                        })}
                    </div>
                </div>

                <AddLeadModal
                    isOpen={isAddLeadModalOpen}
                    onClose={handleCloseAddLeadModal}
                    onSave={handleSaveNewLead}
                    initialColumnId={addLeadInitialColumnId}
                    contacts={contacts}
                    products={products}
                />

                {leadToDelete && (
                    <DeleteLeadModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onDelete={handleDeleteModalConfirm}
                        lead={leadToDelete}
                    />
                )}

                <EditColumnModal
                    isOpen={isEditColumnModalOpen}
                    onClose={handleCloseEditColumnModal}
                    onSuccess={handleEditColumnSuccess}
                    column={columnToEdit}
                />
            </div>
        </>
    );
};

export default BoardView;
