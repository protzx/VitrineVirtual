import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Produto {
    nome: string;
    preco: string;
    imagem: string;
    descricao: string;
}

const FONT_IMPORT_ID = 'vitrine-fonts';

function ensureFonts() {
    if (typeof document === 'undefined') return;
    if (document.getElementById(FONT_IMPORT_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_IMPORT_ID;
    link.rel = 'stylesheet';
    link.href =
        'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
}

export default function App() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const ID_PLANILHA = '1wWJ8T0bhllES5GdMW_kVLcA8Mjg7OCrOg5ZASMPG5Go';
    const NOMEABA = 'Página1';
    const WHATS_LOJISTA = '5542999936768';

    useEffect(() => {
        ensureFonts();
        AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });

        fetch(`https://opensheet.elk.sh/${ID_PLANILHA}/${NOMEABA}`)
            .then((res) => res.json())
            .then((dados) => {
                setProdutos(dados);
                setCarregando(false);
            })
            .catch((err) => {
                console.error('Erro ao carregar produtos:', err);
                setErro(true);
                setCarregando(false);
            });
    }, []);

    return (
        <div style={styles.page}>
            <style>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background-color: #12201D; margin: 0; }

                @keyframes piscar {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.35; }
                }

                .vitrine-card {
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .vitrine-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 18px 40px -12px rgba(232, 163, 61, 0.35), 0 0 0 1px rgba(232,163,61,0.15);
                }

                .pedir-btn {
                    transition: transform 0.15s ease, background-color 0.15s ease;
                }
                .pedir-btn:hover {
                    transform: scale(1.05);
                    background-color: #1ebe5a;
                }

                .luz {
                    animation: piscar 2.4s ease-in-out infinite;
                }

                .skeleton {
                    background: linear-gradient(90deg, #1c2c27 25%, #24362f 37%, #1c2c27 63%);
                    background-size: 400% 100%;
                    animation: skeleton-loading 1.4s ease infinite;
                }
                @keyframes skeleton-loading {
                    0% { background-position: 100% 50%; }
                    100% { background-position: 0 50%; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .vitrine-card, .pedir-btn, .luz, .skeleton { animation: none !important; transition: none !important; }
                }
            `}</style>

            <header style={styles.header}>
                <div style={styles.marquee} aria-hidden="true">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <span
                            key={i}
                            className="luz"
                            style={{
                                ...styles.bulb,
                                animationDelay: `${(i % 6) * 0.35}s`,
                            }}
                        />
                    ))}
                </div>
                <h1 style={styles.titulo}>Vitrine Digital</h1>
                <p style={styles.subtitulo}>Atualizado direto da planilha • peça pelo WhatsApp</p>
            </header>

            <main style={styles.grid}>
                {carregando &&
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} style={styles.card}>
                            <div className="skeleton" style={{ width: '100%', height: 200 }} />
                            <div style={{ padding: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div className="skeleton" style={{ height: 18, borderRadius: 4, width: '70%' }} />
                                <div className="skeleton" style={{ height: 12, borderRadius: 4, width: '100%' }} />
                                <div className="skeleton" style={{ height: 12, borderRadius: 4, width: '85%' }} />
                            </div>
                        </div>
                    ))}

                {!carregando && erro && (
                    <div style={styles.estadoVazio}>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Não deu pra abrir a vitrine agora.</p>
                        <p style={{ color: '#9fb0aa', marginTop: 8 }}>
                            Verifique sua conexão e recarregue a página em instantes.
                        </p>
                    </div>
                )}

                {!carregando && !erro && produtos.length === 0 && (
                    <div style={styles.estadoVazio}>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>A vitrine está vazia por enquanto.</p>
                        <p style={{ color: '#9fb0aa', marginTop: 8 }}>Assim que a planilha tiver produtos, eles aparecem aqui.</p>
                    </div>
                )}

                {!carregando &&
                    !erro &&
                    produtos.map((produto, index) => {
                        const mensagem = `Quero comprar o produto ${produto.nome} no valor de R$ ${produto.preco}`;
                        const url = `https://wa.me/${WHATS_LOJISTA}?text=${encodeURIComponent(mensagem)}`;

                        return (
                            <div
                                key={index}
                                className="vitrine-card"
                                style={styles.card}
                                data-aos="fade-up"
                                data-aos-delay={(index % 4) * 80}
                            >
                                <div style={styles.imagemWrap}>
                                    <img
                                        src={produto.imagem}
                                        alt={produto.nome}
                                        style={styles.imagem}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'data:image/svg+xml;utf8,' +
                                                encodeURIComponent(
                                                    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="200"><rect width="100%" height="100%" fill="#e9e2cf"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="#8a7f63" text-anchor="middle" dy=".3em">Sem imagem</text></svg>`
                                                );
                                        }}
                                    />
                                </div>

                                <div style={styles.corpo}>
                                    <div>
                                        <h3 style={styles.nomeProduto}>{produto.nome}</h3>
                                        <p style={styles.descricao}>{produto.descricao}</p>
                                    </div>

                                    <div style={styles.rodapeCard}>
                                        <span style={styles.preco}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 500, marginRight: 3 }}>R$</span>
                                            {produto.preco}
                                        </span>

                                        <a href={url} target="_blank" rel="noreferrer" className="pedir-btn" style={styles.botao}>
                                            Pedir
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </main>

            <footer style={styles.footer}>Desenvolvido por Protz Dev</footer>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        backgroundColor: '#12201D',
        color: '#FFFBF2',
        fontFamily: "'Manrope', sans-serif",
        minHeight: '100vh',
        padding: '20px 20px 60px',
    },
    header: {
        marginBottom: 48,
        textAlign: 'center',
        paddingTop: 10,
    },
    marquee: {
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 18,
    },
    bulb: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: '#E8A33D',
        boxShadow: '0 0 8px 2px rgba(232,163,61,0.7)',
        display: 'inline-block',
    },
    titulo: {
        fontFamily: "'Fraunces', serif",
        fontSize: '3.2rem',
        fontWeight: 600,
        margin: '0 0 10px 0',
        letterSpacing: '-0.02em',
    },
    subtitulo: {
        color: '#9fb0aa',
        margin: 0,
        fontSize: '0.95rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 24,
        maxWidth: 1200,
        margin: '0 auto',
    },
    card: {
        backgroundColor: '#FFFBF2',
        color: '#16211D',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        height: 400,
    },
    imagemWrap: {
        width: '100%',
        height: 200,
        backgroundColor: '#F1EAD6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    imagem: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
    corpo: {
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    nomeProduto: {
        fontFamily: "'Fraunces', serif",
        margin: '0 0 8px 0',
        fontSize: '1.15rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    descricao: {
        color: '#5c6a63',
        fontSize: '0.85rem',
        margin: 0,
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    rodapeCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    preco: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#B9781E',
    },
    botao: {
        backgroundColor: '#25D366',
        color: '#ffffff',
        textDecoration: 'none',
        padding: '9px 14px',
        borderRadius: 8,
        fontSize: '0.85rem',
        fontWeight: 700,
        display: 'inline-block',
    },
    estadoVazio: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '60px 20px',
        color: '#FFFBF2',
    },
    footer: {
        textAlign: 'center',
        color: '#5c7268',
        fontSize: '0.8rem',
        marginTop: 50,
    },
};