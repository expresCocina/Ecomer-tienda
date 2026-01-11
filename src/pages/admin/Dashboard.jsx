import { useState } from 'react';
import { LiveUserMap } from '../../components/admin/LiveUserMap';
import { Users, Globe, Activity } from 'lucide-react';

/**
 * Página del dashboard - Panel principal del administrador
 */
export const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Panel de control y monitoreo en tiempo real
                    </p>
                </div>

                {/* Contenido Principal */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Sección: Mapa de Usuarios en Vivo */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Usuarios en Vivo
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Monitoreo geográfico en tiempo real
                                </p>
                            </div>
                        </div>

                        {/* Mapa */}
                        <div className="h-[600px]">
                            <LiveUserMap />
                        </div>
                    </div>

                    {/* Tarjetas Informativas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-center justify-between mb-4">
                                <Users className="w-8 h-8 text-blue-600" />
                                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                    ACTIVO
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Visitantes Activos</p>
                            <p className="text-2xl font-bold text-gray-900">En tiempo real</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                            <div className="flex items-center justify-between mb-4">
                                <Globe className="w-8 h-8 text-green-600" />
                                <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                    GLOBAL
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Alcance Global</p>
                            <p className="text-2xl font-bold text-gray-900">Múltiples países</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                            <div className="flex items-center justify-between mb-4">
                                <Activity className="w-8 h-8 text-purple-600" />
                                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                    LIVE
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">Actualización</p>
                            <p className="text-2xl font-bold text-gray-900">Tiempo real</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
