import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

/**
 * Página de Contacto
 */
export const Contact = () => {
    const { settings, loadSettings } = useSettingsStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simular envío (aquí puedes integrar con un servicio de email)
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSubmitted(true);
        setLoading(false);

        // Resetear formulario después de 3 segundos
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', message: '' });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 pt-20 sm:pt-24 md:pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        ¿Tienes alguna pregunta?
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cards de contacto */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Email */}
                        {settings?.contact_email && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Mail className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                                <a
                                    href={`mailto:${settings.contact_email}`}
                                    className="text-primary-600 hover:text-primary-700 font-medium break-all"
                                >
                                    {settings.contact_email}
                                </a>
                            </div>
                        )}

                        {/* Teléfono */}
                        {settings?.contact_phone && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Phone className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Teléfono</h3>
                                <a
                                    href={`tel:${settings.contact_phone}`}
                                    className="text-green-600 hover:text-green-700 font-medium"
                                >
                                    {settings.contact_phone}
                                </a>
                            </div>
                        )}

                        {/* Dirección */}
                        {settings?.contact_address && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dirección</h3>
                                <p className="text-gray-600">
                                    {settings.contact_address}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Formulario de contacto */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Envíanos un mensaje
                            </h2>

                            {submitted ? (
                                <div className="text-center py-12 animate-fade-in">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        ¡Mensaje Enviado!
                                    </h3>
                                    <p className="text-gray-600">
                                        Gracias por contactarnos. Te responderemos pronto.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Nombre */}
                                    <Input
                                        label="Nombre completo"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Juan Pérez"
                                        required
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Email */}
                                        <Input
                                            label="Email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="juan@ejemplo.com"
                                            required
                                        />

                                        {/* Teléfono */}
                                        <Input
                                            label="Teléfono"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+57 300 123 4567"
                                        />
                                    </div>

                                    {/* Mensaje */}
                                    <Textarea
                                        label="Mensaje"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Cuéntanos cómo podemos ayudarte..."
                                        rows={6}
                                        required
                                    />

                                    {/* Botón de envío */}
                                    <Button
                                        type="submit"
                                        loading={loading}
                                        disabled={loading}
                                        className="w-full group"
                                        size="lg"
                                    >
                                        <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                                        {loading ? 'Enviando...' : 'Enviar Mensaje'}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sección adicional de información */}
                <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center animate-fade-in">
                    <h2 className="text-3xl font-bold mb-4">
                        ¿Prefieres hablar directamente?
                    </h2>
                    <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                        Nuestro equipo está disponible de lunes a viernes de 9:00 AM a 6:00 PM
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {settings?.contact_phone && (
                            <a
                                href={`tel:${settings.contact_phone}`}
                                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center gap-2"
                            >
                                <Phone className="w-5 h-5" />
                                Llámanos Ahora
                            </a>
                        )}
                        {settings?.contact_email && (
                            <a
                                href={`mailto:${settings.contact_email}`}
                                className="bg-primary-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors inline-flex items-center gap-2"
                            >
                                <Mail className="w-5 h-5" />
                                Escríbenos
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
