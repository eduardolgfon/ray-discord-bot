const structure = require("../../components/structures")
module.exports = class TesteCommand extends structure {
	constructor(ray) {
		super(ray, {
			name: "teste",
			aliases: [],
			category: "private",
			cooldown: 3,
			dm: false,
			Memberperm: [],
			Rayperm: ["ATTACH_FILES"],
			dev: false
		})
	}
	async execute({ message }, t) {
		let videos = ['https://cdn.discordapp.com/attachments/788376558271201290/868258432581517312/VID-20201201-WA0067.mp4', 'https://cdn.discordapp.com/attachments/865638893406912542/868650829916278864/VID-20210512-WA0435.mp4',
		'https://cdn.discordapp.com/attachments/788376558271201290/868258428206862416/VID-20210322-WA0003.mp4', 'https://cdn.discordapp.com/attachments/865638893406912542/868650690451501086/Facebook_undefinedSource_1.mp4',
		'https://cdn.discordapp.com/attachments/865638893406912542/868650689621024798/VID-20210529150545.mp4', 'https://cdn.discordapp.com/attachments/865638893406912542/868650688509513769/192182262_849091769037318_5980139146847994686_n.mp4',
		'https://cdn.discordapp.com/attachments/865638893406912542/868650686970204170/ae06a96dd51f4f9f9c67d09d83dd729b.mp4', 'https://cdn.discordapp.com/attachments/865638893406912542/868650625485901874/3db95c26f7654704b8e8aff37ddb61a4.mp4',
		'https://cdn.discordapp.com/attachments/865638893406912542/868650622214340618/VID-20210313-WA0009.mp4', 'https://cdn.discordapp.com/attachments/865638893406912542/868650090242375781/VID-20210625-WA0202.mp4',
		'https://cdn.discordapp.com/attachments/865638893406912542/868650087729995856/193670953_886723685208490_6528351031151328614_n.mp4'
	]
		let video = videos[Math.floor((Math.random() * videos.length))]
		message.channel.send({ files: [{ attachment: video, name: 'teste.mp4' }] })
	}
	async slash({ interaction }, t) {
		let videos = ['https://cdn.discordapp.com/attachments/788376558271201290/868258432581517312/VID-20201201-WA0067.mp4', 'https://cdn.discordapp.com/attachments/865638893406912542/868650829916278864/VID-20210512-WA0435.mp4',
		'https://cdn.discordapp.com/attachments/788376558271201290/868258428206862416/VID-20210322-WA0003.mp4', 'https://cdn.discordapp.com/attachments/865638893406912542/868650690451501086/Facebook_undefinedSource_1.mp4',
		'https://cdn.discordapp.com/attachments/865638893406912542/868650689621024798/VID-20210529150545.mp4', 'https://cdn.discordapp.com/attachments/865638893406912542/868650688509513769/192182262_849091769037318_5980139146847994686_n.mp4',
		'https://cdn.discordapp.com/attachments/865638893406912542/868650686970204170/ae06a96dd51f4f9f9c67d09d83dd729b.mp4', 'https://cdn.discordapp.com/attachments/865638893406912542/868650625485901874/3db95c26f7654704b8e8aff37ddb61a4.mp4',
		'https://cdn.discordapp.com/attachments/865638893406912542/868650622214340618/VID-20210313-WA0009.mp4', 'https://cdn.discordapp.com/attachments/865638893406912542/868650090242375781/VID-20210625-WA0202.mp4',
		'https://cdn.discordapp.com/attachments/865638893406912542/868650087729995856/193670953_886723685208490_6528351031151328614_n.mp4'
	]
		let video = videos[Math.floor((Math.random() * videos.length))]
		interaction.reply({ files: [{ attachment: video, name: 'teste.mp4' }] })
		await interaction.deferReply({ ephemeral: true });
		setTimeout(() => {
			interaction.editReply('fodase')
		}, 3000);
	}
}