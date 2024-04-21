const {
  Client,
  Intents,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const rules = require("./rules.json");
const fs = require("fs");
const { startServer } = require("./alive.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!rules") {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select")
          .setPlaceholder("قائمة القوانين")
          .addOptions(
            rules.map((rule) => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            })),
          ),
      );

      const embed = new MessageEmbed()
        .setColor("#ec2444")
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/1228073471905370218/1230719591144095764/logo_2.png?ex=663457f0&is=6621e2f0&hm=7ca64a9e6d471ef2c60b9cd31b8fc2ce111e09cc0b2675f98c81c4cfc056157d&",
        )
        .setTitle("قوانين السيرفر")
        .setDescription(
          "**الرجاء اختيار احد القوانين لقرائته من قائمة الاختيارات تحت**",
        )
        .setImage(
          "https://cdn.discordapp.com/attachments/1228073471905370218/1229691191214211102/BANAR.png?ex=66236b2a&is=662219aa&hm=d8fadafd9962aa0a107b69f1&",
        )
        .setFooter({ text: "Rules Bot" })
        .setTimestamp();

      const sentMessage = await message.channel.send({
        embeds: [embed],
        components: [row],
      });
      await message.delete();
    } else {
      await message.reply({
        content: "You need to be an administrator to use this command.",
        ephemeral: true,
      });
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find((r) => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, "utf-8");
    const ruleEmbed = new MessageEmbed()
      .setColor("#ec2444")
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: "Rules Bot" })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
