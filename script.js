function comprar(nome) {
    const numero = "5511999999999"; // SEU WHATS
    const mensagem = `Olá! Tenho interesse no produto: ${nome}`;
    
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, "_blank");
}
