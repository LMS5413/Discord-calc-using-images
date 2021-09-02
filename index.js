const Discord = require('discord.js')
const client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES']})
const { createWorker } = require('tesseract.js');
const math = require('mathjs')

client.on('ready', () => {
    console.log('Bot online!')
})
client.on('messageCreate', async (message) => {
    if(message.author.bot || message.channel.type === 'DM') return;
    if(message.content === '!calc') {
        const worker = createWorker();
        try {
            const attachment = message.attachments.first()
            if(!attachment) return message.reply('Coloque uma imagem anexada')
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(attachment.url);
            console.log(text)
            var res = math.evaluate(text.replace('|', '')).entries
            if(text.includes('=')) {
                let separe = text.split('=')
                console.log(res)
                message.channel.send(`Pegando base na sua imagem posso deduzir que: \n \n${separe[0]} = ${Math.max(...res)}`)
                await worker.terminate();
            } else {
                message.channel.send(`Pegando base na sua imagem posso deduzir que: \n \n${text.replace(/\n/g, ' ')} = ${Math.max(...res)}`)
                await worker.terminate();
            }
        } catch (e) {
            console.log(e)
            message.reply(`Não foi possivel determinar esse calculo: Erro: ${e.message}`)
            await worker.terminate();
        }
    }

})
client.login('')