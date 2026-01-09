import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Upload, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { supabase, uploadProductImage } from '../../lib/supabase';

/**
 * Página de configuración del negocio
 */
export const Configuracion = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        business_name: '',
        business_description: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        whatsapp_number: '',
        currency: 'USD',
        logo_url: '',
        favicon_url: '',
    });
    const [logoFile, setLogoFile] = useState(null);
    const [faviconFile, setFaviconFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setFormData({
                    business_name: data.business_name || '',
                    business_description: data.business_description || '',
                    contact_email: data.contact_email || '',
                    contact_phone: data.contact_phone || '',
                    contact_address: data.contact_address || '',
                    facebook_url: data.facebook_url || '',
                    instagram_url: data.instagram_url || '',
                    twitter_url: data.twitter_url || '',
                    whatsapp_number: data.whatsapp_number || '',
                    currency: data.currency || 'USD',
                    logo_url: data.logo_url || '',
                    favicon_url: data.favicon_url || '',
                });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.business_name) newErrors.business_name = 'Nombre del negocio es requerido';
        if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
            newErrors.contact_email = 'Email inválido';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setSaving(true);

            let logoUrl = formData.logo_url;
            let faviconUrl = formData.favicon_url;

            // Subir logo si hay uno nuevo
            if (logoFile) {
                logoUrl = await uploadProductImage(logoFile, 'settings');
            }

            // Subir favicon si hay uno nuevo
            if (faviconFile) {
                faviconUrl = await uploadProductImage(faviconFile, 'settings');
            }

            const dataToSave = {
                ...formData,
                logo_url: logoUrl,
                favicon_url: faviconUrl,
            };

            // Verificar si ya existe un registro
            const { data: existing } = await supabase
                .from('settings')
                .select('id')
                .single();

            if (existing) {
                // Actualizar
                const { error } = await supabase
                    .from('settings')
                    .update(dataToSave)
                    .eq('id', existing.id);

                if (error) throw error;
            } else {
                // Insertar
                const { error } = await supabase
                    .from('settings')
                    .insert([dataToSave]);

                if (error) throw error;
            }

            // Recargar configuración para updated URLs
            await loadSettings();
            setLogoFile(null);
            setFaviconFile(null);

            alert('Configuración guardada correctamente');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <SettingsIcon className="w-8 h-8 text-primary-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
                            <p className="text-sm text-gray-600">Ajustes generales del negocio</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulario */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Información del negocio */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold">Información del Negocio</h2>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    <Input
                                        label="Nombre del Negocio"
                                        name="business_name"
                                        value={formData.business_name}
                                        onChange={handleChange}
                                        error={errors.business_name}
                                        placeholder="Mi Tienda"
                                        required
                                    />
                                    <Textarea
                                        label="Descripción"
                                        name="business_description"
                                        value={formData.business_description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Descripción breve de tu negocio"
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Logo y Favicon */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold">Marca Visual</h2>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-6">
                                    {/* Logo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Logo
                                        </label>
                                        <p className="text-xs text-gray-500 mb-3">
                                            📐 <strong>Medidas recomendadas:</strong> 400px ancho × 80px alto (horizontal) o 200×200px (cuadrado).
                                            Fondo transparente (PNG) funciona mejor.
                                        </p>
                                        {formData.logo_url && (
                                            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-600 mb-2">Logo actual:</p>
                                                <img
                                                    src={formData.logo_url}
                                                    alt="Logo actual"
                                                    className="h-16 object-contain"
                                                />
                                            </div>
                                        )}
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600">
                                                {logoFile ? logoFile.name : 'Haz clic para subir logo'}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">PNG, JPG o SVG · Máx. 2MB</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setLogoFile(e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* Favicon */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Favicon (icono pestaña navegador)
                                        </label>
                                        <p className="text-xs text-gray-500 mb-3">
                                            📐 <strong>Medidas exactas:</strong> 32×32px o 64×64px (PNG).
                                            Para mejor compatibilidad usa formato cuadrado.
                                        </p>
                                        {formData.favicon_url && (
                                            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-600 mb-2">Favicon actual:</p>
                                                <img
                                                    src={formData.favicon_url}
                                                    alt="Favicon actual"
                                                    className="h-8 w-8 object-contain border border-gray-300"
                                                />
                                            </div>
                                        )}
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600">
                                                {faviconFile ? faviconFile.name : 'Haz clic para subir favicon'}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">PNG o ICO · 32×32px o 64×64px</span>
                                            <input
                                                type="file"
                                                accept="image/*,.ico"
                                                onChange={(e) => setFaviconFile(e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Contacto */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold">Información de Contacto</h2>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    <Input
                                        label="Email de Contacto"
                                        name="contact_email"
                                        type="email"
                                        value={formData.contact_email}
                                        onChange={handleChange}
                                        error={errors.contact_email}
                                        placeholder="contacto@mitienda.com"
                                    />
                                    <Input
                                        label="Teléfono"
                                        name="contact_phone"
                                        type="tel"
                                        value={formData.contact_phone}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 8900"
                                    />
                                    <Textarea
                                        label="Dirección"
                                        name="contact_address"
                                        value={formData.contact_address}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Calle 123, Ciudad, País"
                                    />
                                    <Input
                                        label="WhatsApp (con código de país)"
                                        name="whatsapp_number"
                                        type="tel"
                                        value={formData.whatsapp_number}
                                        onChange={handleChange}
                                        placeholder="+1234567890"
                                        helperText="Formato: +[código país][número] sin espacios"
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Redes Sociales */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold">Redes Sociales</h2>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    <Input
                                        label="Facebook"
                                        name="facebook_url"
                                        type="url"
                                        value={formData.facebook_url}
                                        onChange={handleChange}
                                        placeholder="https://facebook.com/tutienda"
                                    />
                                    <Input
                                        label="Instagram"
                                        name="instagram_url"
                                        type="url"
                                        value={formData.instagram_url}
                                        onChange={handleChange}
                                        placeholder="https://instagram.com/tutienda"
                                    />
                                    <Input
                                        label="Twitter/X"
                                        name="twitter_url"
                                        type="url"
                                        value={formData.twitter_url}
                                        onChange={handleChange}
                                        placeholder="https://twitter.com/tutienda"
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        {/* Ajustes Generales */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-lg font-semibold">Ajustes Generales</h2>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Moneda
                                        </label>
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="MXN">MXN ($)</option>
                                            <option value="COP">COP ($)</option>
                                            <option value="ARS">ARS ($)</option>
                                        </select>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Botón guardar */}
                        <div className="flex justify-end">
                            <Button type="submit" loading={saving} disabled={saving} size="lg">
                                <Save className="w-5 h-5 mr-2" />
                                {saving ? 'Guardando...' : 'Guardar Configuración'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
