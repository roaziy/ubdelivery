'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useNotifications } from '@/components/ui/Notification';
import { IoAdd, IoTrash, IoPencil, IoImageOutline } from 'react-icons/io5';
import Image from 'next/image';
import api, { uploadFile } from '@/lib/api';

interface Banner {
    id: string;
    title?: string;
    image_url: string;
    link?: string;
    is_active: boolean;
    sort_order: number;
}

export default function BannersPage() {
    const notify = useNotifications();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        is_active: true,
        sort_order: 0,
        image: null as File | null
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const response = await api.get<Banner[]>('/banners');
            if (response.success && response.data) {
                setBanners(Array.isArray(response.data) ? response.data : []);
            } else {
                notify.error('Алдаа', response.error || 'Баннеруудыг ачаалахад алдаа гарлаа');
            }
        } catch (error) {
            console.error('Failed to fetch banners:', error);
            notify.error('Алдаа', 'Баннеруудыг ачаалахад алдаа гарлаа');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title || '',
                link: banner.link || '',
                is_active: banner.is_active,
                sort_order: banner.sort_order,
                image: null
            });
            setImagePreview(banner.image_url);
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                link: '',
                is_active: true,
                sort_order: banners.length,
                image: null
            });
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
        setFormData({
            title: '',
            link: '',
            is_active: true,
            sort_order: 0,
            image: null
        });
        setImagePreview(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (editingBanner) {
                // Update existing banner
                if (formData.image) {
                    // Upload new image
                    const formDataToSend = new FormData();
                    formDataToSend.append('image', formData.image);
                    
                    const imageResponse = await uploadFile<Banner>(
                        `/banners/${editingBanner.id}/image`,
                        formDataToSend
                    );
                    
                    if (!imageResponse.success) {
                        throw new Error(imageResponse.error || 'Зураг хадгалахад алдаа гарлаа');
                    }
                }
                
                // Update banner data
                const updateResponse = await api.put<Banner>(
                    `/banners/${editingBanner.id}`,
                    {
                        title: formData.title,
                        link: formData.link,
                        is_active: formData.is_active,
                        sort_order: formData.sort_order
                    }
                );
                
                if (updateResponse.success) {
                    notify.success('Амжилттай', 'Баннер шинэчлэгдлээ');
                    fetchBanners();
                    handleCloseModal();
                } else {
                    throw new Error(updateResponse.error || 'Шинэчлэхэд алдаа гарлаа');
                }
            } else {
                // Create new banner
                if (!formData.image) {
                    notify.error('Алдаа', 'Зураг оруулах шаардлагатай');
                    return;
                }
                
                const formDataToSend = new FormData();
                formDataToSend.append('image', formData.image);
                formDataToSend.append('title', formData.title);
                formDataToSend.append('link', formData.link);
                formDataToSend.append('is_active', formData.is_active.toString());
                formDataToSend.append('sort_order', formData.sort_order.toString());
                
                const response = await uploadFile<Banner>('/banners', formDataToSend);
                
                if (response.success) {
                    notify.success('Амжилттай', 'Баннер үүсгэгдлээ');
                    fetchBanners();
                    handleCloseModal();
                } else {
                    throw new Error(response.error || 'Үүсгэхэд алдаа гарлаа');
                }
            }
        } catch (error) {
            console.error('Banner save error:', error);
            notify.error('Алдаа', error instanceof Error ? error.message : 'Хадгалахад алдаа гарлаа');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Та энэ баннерыг устгахдаа итгэлтэй байна уу?')) {
            return;
        }

        try {
            const response = await api.delete<{ message: string }>(`/banners/${id}`);
            if (response.success) {
                notify.success('Амжилттай', 'Баннер устгагдлаа');
                fetchBanners();
            } else {
                throw new Error(response.error || 'Устгахад алдаа гарлаа');
            }
        } catch (error) {
            console.error('Delete error:', error);
            notify.error('Алдаа', 'Устгахад алдаа гарлаа');
        }
    };

    const handleToggleActive = async (banner: Banner) => {
        try {
            const response = await api.put<Banner>(
                `/banners/${banner.id}`,
                {
                    is_active: !banner.is_active
                }
            );
            
            if (response.success) {
                notify.success('Амжилттай', `Баннер ${!banner.is_active ? 'идэвхжсэн' : 'идэвхгүй болсон'}`);
                fetchBanners();
            } else {
                notify.error('Алдаа', response.error || 'Өөрчлөхөд алдаа гарлаа');
            }
        } catch (error) {
            console.error('Toggle error:', error);
            notify.error('Алдаа', 'Өөрчлөхөд алдаа гарлаа');
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-mainBlack">Коммерциал баннерууд</h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-mainGreen text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                        <IoAdd size={20} />
                        Шинэ баннер
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-mainGreen border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : banners.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Баннер олдсонгүй
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="relative h-48 bg-gray-200">
                                    {banner.image_url ? (
                                        <Image
                                            src={banner.image_url}
                                            alt={banner.title || 'Banner'}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <IoImageOutline size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                banner.is_active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {banner.is_active ? 'Идэвхтэй' : 'Идэвхгүй'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold mb-1">{banner.title || 'Байхгүй гарчиг'}</h3>
                                    {banner.link && (
                                        <p className="text-sm text-gray-500 mb-3 truncate">{banner.link}</p>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleActive(banner)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                banner.is_active
                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        >
                                            {banner.is_active ? 'Идэвхгүй болгох' : 'Идэвхжүүлэх'}
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(banner)}
                                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                        >
                                            <IoPencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            <IoTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">
                                {editingBanner ? 'Баннер засварлах' : 'Шинэ баннер'}
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Гарчиг</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                                        placeholder="Баннерын гарчиг"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Холбоос</label>
                                    <input
                                        type="text"
                                        value={formData.link}
                                        onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                                        placeholder="/home/foods"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Зураг</label>
                                    {imagePreview ? (
                                        <div className="relative h-48 mb-2 rounded-lg overflow-hidden">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : null}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                            className="w-4 h-4 text-mainGreen rounded focus:ring-mainGreen"
                                        />
                                        <span className="text-sm">Идэвхтэй</span>
                                    </label>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium mb-1">Эрэмбэ</label>
                                        <input
                                            type="number"
                                            value={formData.sort_order}
                                            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mainGreen focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Болих
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2 bg-mainGreen text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Хадгалах
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

