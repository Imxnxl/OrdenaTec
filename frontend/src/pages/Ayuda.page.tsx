// ============================================
// OrdenaTEC — Ayuda (FAQ) Page
// Premium UI with accordion micro-animations
// ============================================

import React, { useState } from 'react';
import './Ayuda.css';

interface FAQ {
    id: number;
    qu: string;
    ans: string;
}

const FAQS: FAQ[] = [
    {
        id: 1,
        qu: "¿Qué métodos de pago aceptan?",
        ans: "Aceptamos una gran variedad de métodos de pago, incluyendo tarjetas de crédito y débito (Visa, MasterCard, American Express), transferencias bancarias SPEI, pagos en efectivo a través de tiendas de conveniencia (OXXO, 7-Eleven) y PayPal. Todos los pagos son procesados de forma segura."
    },
    {
        id: 2,
        qu: "¿Cómo puedo pagar?",
        ans: "Al finalizar el armado de tu PC o agregar artículos a tu carrito, dirígete a la sección 'Checkout'. Allí podrás seleccionar tu método de pago preferido, ingresar tus datos de envío y confirmar tu pedido en pasos sencillos y encriptados."
    },
    {
        id: 3,
        qu: "¿Es seguro comprar en esta página?",
        ans: "Absolutamente. Contamos con certificados de seguridad SSL de última generación y trabajamos con pasarelas de pago certificadas internacionalmente para proteger tus datos financieros. Tu información está cifrada de extremo a extremo."
    },
    {
        id: 4,
        qu: "¿Tienen envío a todo el país?",
        ans: "Sí, realizamos envíos a toda la República Mexicana a través de paqueterías reconocidas como DHL, FedEx y Estafeta, garantizando que tu paquete llegue seguro hasta la puerta de tu casa."
    },
    {
        id: 5,
        qu: "¿Cuál es el costo del envío?",
        ans: "El costo de envío estándar es de $150 MXN. Sin embargo, para computadoras armadas completas o compras superiores a los $5,000 MXN, ¡el envío es totalmente GRATIS!"
    },
    {
        id: 6,
        qu: "¿Cuánto tiempo tarda en llegar mi pedido?",
        ans: "Si compraste componentes individuales, el tiempo de entrega es de 2 a 4 días hábiles. Si adquiriste una PC ensamblada por nuestro equipo, requerimos de 2 a 3 días adicionales para el armado, pruebas de estrés y empaquetado seguro."
    },
    {
        id: 7,
        qu: "¿Puedo rastrear mi pedido?",
        ans: "Por supuesto. Una vez que tu pedido sea despachado y entregado a la paquetería, recibirás un correo electrónico con tu número de guía y un enlace para rastrearlo en tiempo real."
    },
    {
        id: 8,
        qu: "¿Qué hago si recibo un componente dañado o defectuoso?",
        ans: "En caso de que algún artículo llegue dañado de fábrica o por el transporte, tienes hasta 7 días desde la recepción para comunicarte con nosotros. Te daremos una guía prepagada para devolverlo y te enviaremos el reemplazo de forma inmediata sin costo alguno."
    },
    {
        id: 9,
        qu: "¿Cuál es el tiempo de garantía de los componentes?",
        ans: "Todos nuestros componentes tienen un mínimo de 1 año de garantía directa con nosotros o con el fabricante. Algunos componentes Premium (fuentes de poder o memorias RAM) pueden contar con garantías extendidas de 3, 5 a 10 años dependiendo de la marca."
    },
    {
        id: 10,
        qu: "¿Ustedes arman la PC si elijo todos los componentes?",
        ans: "¡Sí! Al usar nuestro Configurador se habilitará la opción para que nuestros expertos realicen el ensamble por ti, gestionando los cables de forma limpia e instalando el sistema operativo sin activar."
    },
    {
        id: 11,
        qu: "¿En caso de error en mi configuración, me avisan antes de enviar?",
        ans: "Nuestro configurador inteligente está diseñado para evitar esto, pero cada pedido de PC armada es revisado humanamente antes del ensamble. Si notamos algún problema grave de cuello de botella o incompatibilidad de hardware, nos comunicaremos contigo antes de armarla."
    },
    {
        id: 12,
        qu: "¿Puedo cancelar o modificar mi pedido después de pagarlo?",
        ans: "Puedes solicitar una cancelación o modificación siempre y cuando el pedido no haya sido marcado como 'En Proceso de Empaquetado' o 'Enviado'. Recomendamos que te contactes de inmediato en nuestro canal telefónico si deseas modificarlo."
    },
    {
        id: 13,
        qu: "¿Tienen tienda física donde pueda recoger mi compra?",
        ans: "Actualmente operamos de manera 100% digital a través de envíos para mantener precios más competitivos, centralizando toda nuestra logística y operación desde nuestras bodegas."
    },
    {
        id: 14,
        qu: "¿Ofrecen soporte técnico para el armado de mi PC?",
        ans: "Sí, si decides comprar los componentes para armarla tú mismo y te surge alguna duda o complicación durante el ensamblaje, puedes contactar a nuestro chat de soporte para orientación básica gratuita."
    },
    {
        id: 15,
        qu: "¿Cómo contacto al equipo de atención al cliente?",
        ans: "Puedes comunicarte con nosotros de Lunes a Sábado de 9 AM a 7 PM a través del chat en vivo situado en la esquina inferior derecha, escribiendo a nuestro correo de contacto (soporte@ordenatec.com) o llamando al teléfono 800-ORDENAT."
    }
];

const AyudaPage: React.FC = () => {
    const [openId, setOpenId] = useState<number | null>(1); // Inicia con la primera pregunta abierta

    const toggleAccordion = (id: number) => {
        setOpenId(prev => prev === id ? null : id);
    };

    return (
        <div className="ayuda-page">
            <div className="ayuda-header">
                <h1>Centro de Ayuda</h1>
                <p>Respuestas rápidas a tus preguntas más frecuentes sobre OrdenaTEC, envíos y pagos.</p>
            </div>

            <div className="faq-container">
                {FAQS.map(faq => (
                    <div
                        key={faq.id}
                        className={`faq-item ${openId === faq.id ? 'active' : ''}`}
                    >
                        <button
                            className="faq-question"
                            onClick={() => toggleAccordion(faq.id)}
                            aria-expanded={openId === faq.id}
                        >
                            <span>{faq.qu}</span>
                            <span className="faq-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </button>
                        <div className="faq-answer-container">
                            <div className="faq-answer">
                                {faq.ans}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="help-contact-banner">
                <h2>¿Aún tienes dudas?</h2>
                <p>Nuestro equipo de expertos está listo para ayudarte con tu configuración.</p>
                <button className="btn btn-primary" onClick={() => window.location.href = 'mailto:soporte@ordenatec.com'}>
                    Contactar a Soporte
                </button>
            </div>
        </div>
    );
};

export default AyudaPage;
