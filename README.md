# Meu Look — MVP utilizável no iPhone

Esta pasta contém um MVP web/PWA que pode ser aberto no Safari do iPhone.

## O que já funciona
- cadastro de foto das roupas;
- câmera/galeria do iPhone;
- categorias e cores;
- guarda-roupa local;
- cadastro de foto de corpo inteiro;
- criação de combinações por ocasião;
- salvamento local dos dados;
- estrutura para favoritos;
- interface mobile.

## O que ainda exige um serviço de IA
A função “você vestindo o look” de forma realista precisa de um motor de geração/edição de imagens. Isso não deve ser colocado diretamente no app com uma chave secreta. O caminho correto é:
iPhone → backend seguro → serviço de IA → imagem final → iPhone.

## Para usar no iPhone
O MVP precisa ser publicado em um endereço HTTPS para o Safari poder usar câmera/galeria e para você poder escolher “Adicionar à Tela de Início”.

## Para virar App Store
Será necessário:
- Mac com Xcode;
- conta Apple Developer;
- projeto iOS;
- backend seguro;
- serviço de IA para provador virtual;
- política de privacidade e termos de uso.

Este pacote é a base funcional do produto; não é ainda um arquivo IPA pronto para instalação.
