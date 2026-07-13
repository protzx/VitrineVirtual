import {useState, useEffect} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
interface Produto {
    nome: string,
    preco: string,
    imagem: string,
    descricao: string
}

export default function App() {
const [produtos, setProdutos] = useState<Produto[]>([])
const [carregando, setCarregando] = useState(true)
const ID_PLANILHA = '1wWJ8T0bhllES5GdMW_kVLcA8Mjg7OCrOg5ZASMPG5Go'
const NOMEABA = 'Página1'
const WHATS_LOJISTA = '5542999936768'

useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetch(`https://opensheet.elk.sh/${ID_PLANILHA}/${NOMEABA}`)
        .then(res => res.json())
        .then(dados => {
            setProdutos(dados);
            setCarregando(false);
        })
        .catch(erro => {
            console.error("Erro ao carregar produtos:", erro);
            setCarregando(false)
        })
}, [])

if (carregando) {
    return <div style={{
         display: "flex", justifyContent: "center", alignItems: "center", height: "calc(140vh - 40px)", fontSize: "1.2rem", backgroundColor: "#000000", color: "#ffffff",
    }}>Carregando Vitrine...</div>
}

return (
    <div style={{
        backgroundColor: "#0c0c0c",
        color: "#ffffff",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        padding: "20px"
    }}>
        <style>{`
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                background-color: #0c0c0c;
                margin: 0;
            }
        `}</style>

        <header style={{ marginBottom: "40px", textAlign: "center" }}>
            <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", margin: "0 0 10px 0", fontFamily: 'sans-serif' }}>
                Vitrine Digital
            </h1>
            <p style={{ color: "#a0a0a0", margin: "0" }}>
                Atualizado direto da planilha
            </p>
        </header>

        <main style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto"
        }}> 
            {produtos.map((produto, index) => {
                const mensagem = `Quero comprar o produto ${produto.nome} no valor de R$ ${produto.preco}`
                 const url = `https://wa.me/${WHATS_LOJISTA}?text=${encodeURIComponent(mensagem)}`;
                return (
                    <div key={index} style={{
                        backgroundColor: "#1a1a1a",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #2a2a2a",
                        height: "400px"
                    }}>
                        <div style={{
                            width: "100%",
                            height: "200px",
                            backgroundColor: "#222",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px"
                        }}>
                            <img 
                                src={produto.imagem} 
                                alt={produto.nome} 
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain"
                                }}
                            />
                        </div>
                        
                        <div style={{ padding: "15px", display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-between" }}>
                            <div>
                                <h3 style={{ 
                                    margin: "0 0 8px 0", 
                                    fontSize: "1.1rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>
                                    {produto.nome}
                                </h3>
                                <p style={{ 
                                    color: "#a0a0a0", 
                                    fontSize: "0.85rem", 
                                    margin: "0", 
                                    lineHeight: "1.3",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                }}>
                                    {produto.descricao}
                                </p>
                            </div>
                            
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                                <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4ade80" }}>
                                    R$ {produto.preco}
                                </span>
                                
                                <a 
                                    href={url} 
                                    target='_blank' 
                                    rel='noreferrer'
                                    style={{
                                        backgroundColor: "#25d366",
                                        color: "#ffffff",
                                        textDecoration: "none",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        fontSize: "0.85rem",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Pedir
                                </a>
                            </div>
                        </div>
                    </div>
                )
            })}
        </main>
    </div>
)
}
