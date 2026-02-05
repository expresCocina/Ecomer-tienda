import { useState, useEffect } from 'react';
import { MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Card, CardBody } from '../ui/Card';
import { getProductReviews, createReview } from '../../lib/supabase';

/**
 * Sección completa de reseñas del producto
 */
export const ReviewSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        rating: 5,
        comment: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await getProductReviews(productId);
            setReviews(data || []);
        } catch (error) {
            console.error('Error loading reviews:', error);
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

    const handleRatingChange = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.customer_name.trim()) newErrors.customer_name = 'Nombre es requerido';
        if (!formData.customer_email.trim()) {
            newErrors.customer_email = 'Email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
            newErrors.customer_email = 'Email inválido';
        }
        if (!formData.comment.trim()) newErrors.comment = 'Comentario es requerido';
        if (formData.comment.trim().length < 10) newErrors.comment = 'El comentario debe tener al menos 10 caracteres';
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
            setSubmitting(true);
            await createReview({
                product_id: productId,
                ...formData,
            });

            // Resetear formulario
            setFormData({
                customer_name: '',
                customer_email: '',
                rating: 5,
                comment: '',
            });
            setErrors({});

            // Recargar reseñas
            await loadReviews();
            alert('¡Gracias por tu reseña!');
        } catch (error) {
            console.error('Error creating review:', error);
            alert('Error al enviar la reseña. Por favor intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            {/* Header con estadísticas */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <MessageCircle className="w-6 h-6 text-gold-400" />
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-gold-400">
                        Reseñas de Clientes
                    </h2>
                </div>
                {reviews.length > 0 && (
                    <div className="flex items-center gap-3 pl-9">
                        <StarRating rating={averageRating} size="md" className="text-gold-500" />
                        <span className="text-lg font-semibold text-gold-400">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-400">
                            · {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
                        </span>
                    </div>
                )}
            </div>

            {/* Lista de reseñas - Carrusel horizontal en móvil, grid en desktop */}
            <div className="mb-12">
                {loading ? (
                    <p className="text-center text-gray-400">Cargando reseñas...</p>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 px-6 bg-primary-800/50 rounded-xl border-2 border-gold-500/20">
                        <p className="text-sm text-gray-300">
                            Sé el primero en dejar una reseña para este producto
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Carrusel horizontal en móvil */}
                        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
                            <div className="flex gap-4 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="flex-shrink-0 w-[85vw] sm:w-[70vw] py-6 px-5 bg-primary-800/50 border-2 border-gold-500/20 rounded-xl hover:shadow-lg hover:shadow-gold-500/10 transition-all"
                                        style={{ scrollSnapAlign: 'start' }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-display font-semibold text-gold-400 text-base">{review.customer_name}</h3>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(review.created_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                            <StarRating rating={review.rating} size="sm" className="text-gold-500" />
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Grid vertical en desktop */}
                        <div className="hidden md:block space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="py-6 px-5 bg-primary-800/50 border-2 border-gold-500/20 rounded-xl hover:shadow-lg hover:shadow-gold-500/10 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-display font-semibold text-gold-400 text-base">{review.customer_name}</h3>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(review.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <StarRating rating={review.rating} size="sm" className="text-gold-500" />
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Formulario para nueva reseña */}
            <div>
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full py-4 px-6 bg-primary-800/50 border-2 border-gold-500/30 text-gold-400 rounded-xl font-medium hover:bg-primary-800 hover:border-gold-500/50 transition-all flex items-center justify-center gap-2 group"
                    >
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        Escribir una Reseña
                        <ChevronDown className="w-4 h-4" />
                    </button>
                ) : (
                    <Card className="animate-slide-up bg-primary-800/50 border-gold-500/20">
                        <CardBody>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display text-xl font-bold text-gold-400">Deja tu Reseña</h3>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-400 hover:text-gold-400 transition-colors"
                                >
                                    <ChevronUp className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Nombre"
                                        name="customer_name"
                                        value={formData.customer_name}
                                        onChange={handleChange}
                                        error={errors.customer_name}
                                        placeholder="Tu nombre"
                                        required
                                    />
                                    <Input
                                        label="Email"
                                        name="customer_email"
                                        type="email"
                                        value={formData.customer_email}
                                        onChange={handleChange}
                                        error={errors.customer_email}
                                        placeholder="tu@email.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gold-400 mb-2">
                                        Calificación
                                    </label>
                                    <StarRating
                                        rating={formData.rating}
                                        onChange={handleRatingChange}
                                        interactive
                                        size="lg"
                                        className="text-gold-500"
                                    />
                                </div>

                                <Textarea
                                    label="Comentario"
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    error={errors.comment}
                                    rows={4}
                                    placeholder="Cuéntanos tu experiencia con este producto..."
                                    required
                                />

                                <Button type="submit" loading={submitting} disabled={submitting} className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-primary-900 font-bold border-2 border-gold-400">
                                    <Send className="w-5 h-5 mr-2" />
                                    {submitting ? 'Enviando...' : 'Enviar Reseña'}
                                </Button>
                            </form>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
};
