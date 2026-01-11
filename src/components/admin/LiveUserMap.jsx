import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { supabase } from '../../lib/supabase';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Componente de mapa en tiempo real que muestra usuarios activos
 */
export const LiveUserMap = () => {
    const [activeSessions, setActiveSessions] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        countries: 0,
        cities: 0
    });

    useEffect(() => {
        // Cargar sesiones activas iniciales
        loadActiveSessions();

        // Suscribirse a cambios en tiempo real
        const channel = supabase
            .channel('active_sessions_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'active_sessions'
                },
                () => {
                    loadActiveSessions();
                }
            )
            .subscribe();

        // Limpiar sesiones antiguas cada minuto
        const cleanupInterval = setInterval(async () => {
            await supabase.rpc('clean_old_sessions');
            loadActiveSessions();
        }, 60 * 1000);

        return () => {
            channel.unsubscribe();
            clearInterval(cleanupInterval);
        };
    }, []);

    const loadActiveSessions = async () => {
        try {
            const { data, error } = await supabase
                .from('active_sessions')
                .select('*')
                .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString())
                .order('last_seen', { ascending: false });

            if (error) throw error;

            if (data) {
                setActiveSessions(data.filter(s => s.latitude && s.longitude));

                // Calcular estadísticas
                const uniqueCountries = new Set(data.map(s => s.country).filter(Boolean));
                const uniqueCities = new Set(data.map(s => s.city).filter(Boolean));

                setStats({
                    total: data.length,
                    countries: uniqueCountries.size,
                    cities: uniqueCities.size
                });
            }
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    };

    const getTimeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return 'Ahora';
        if (seconds < 120) return 'Hace 1 minuto';
        if (seconds < 300) return `Hace ${Math.floor(seconds / 60)} minutos`;
        return 'Hace 5+ minutos';
    };

    return (
        <div className="h-full w-full flex flex-col">
            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Usuarios Activos</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {stats.total}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <p className="text-sm text-gray-600 mb-1">Países</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {stats.countries}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">Ciudades</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {stats.cities}
                    </p>
                </div>
            </div>

            {/* Mapa */}
            <div className="flex-1 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl">
                <MapContainer
                    center={[4.5709, -74.2973]} // Colombia por defecto
                    zoom={6}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {activeSessions.map((session) => (
                        <Marker
                            key={session.id}
                            position={[session.latitude, session.longitude]}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <p className="font-semibold text-primary-600 mb-1">
                                        📍 {session.city}, {session.country}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {session.region && `${session.region} • `}
                                        {getTimeAgo(session.last_seen)}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Lista de usuarios */}
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 max-h-64 overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Usuarios en vivo
                </h3>
                <div className="space-y-2">
                    {activeSessions.slice(0, 10).map((session) => (
                        <div
                            key={session.id}
                            className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                    {session.country_code || '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {session.city || 'Desconocido'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {session.country || 'Desconocido'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">
                                {getTimeAgo(session.last_seen)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
