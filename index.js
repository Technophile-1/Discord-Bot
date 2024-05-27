const Discord = require("discord.js")
const fetch = require("node-fetch")
const keepAlive = require("./server")
const Database = require("@replit/database")

const db = new Database()
const client = new Discord.Client()

const sadWords = ["sad", "depressed", "unhappy", "angry"]

const starterEncouragements = [
  "Cheer up!",
  "Hang in there.",
  "You are a great person / bot!"
]

db.get("encouragements").then(encouragements => {
  if (!encouragements || encouragements.length < 1) {
    db.set("encouragements", starterEncouragements)
  }
})

db.get("responding").then(value => {
  if (value == null) {
    db.set("responding", true)
  }
})

function updateEncouragements(encouragingMessage) {
  db.get("encouragements").then(encouragements => {
    encouragements.push([encouragingMessage])
    db.set("encouragements", encouragements)
  })
}

function deleteEncouragement(index) {
  db.get("encouragements").then(encouragements => {
    if (encouragements.length > index) {
      encouragements.splice(index, 1)
      db.set("encouragements", encouragements)
    }
  })  
}

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.author.bot) return

  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }

  db.get("responding").then(responding =>{
    if (responding && sadWords.some(word => msg.content.includes(word))) {
      db.get("encouragements").then(encouragements => {
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
        msg.reply(encouragement)
      })
    }
  })


  if (msg.content.startsWith("$neekenti mahi topper")) {
    encouragingMessage = msg.content.split("$neekenti mahi topper ")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("avunaaa nijamaa urukoo.")
  }

   if (msg.content.startsWith("$ara em chesthunav")) {
    encouragingMessage = msg.content.split("$ara em chesthunav ")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("kali bava.")
  }

  if (msg.content.startsWith("$i love you bestie")) {
    encouragingMessage = msg.content.split("$i love you bestie ")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("ara thagesavaa.")
  }

  if (msg.content.startsWith("$girls emani reply istaru")) {
    encouragingMessage = msg.content.split("$girls emani reply istaru ")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("Hmm,Mm,Lol,OK.")
  }

  if (msg.content.startsWith("$vati full forms enti mova")) {
    encouragingMessage = msg.content.split("$ vati full forms enti mova")[1]
    updateEncouragements(encouragingMessage)
    msg.channel.send("Hmm = HUG me MORE, Mm = Marry ME,Lol = Lots of LOVE,Ok = One KISS.")
      
  }

  if (msg.content.startsWith("$ara em chesthunav ")) {
    index = parseInt(msg.content.split("$ara em chesthunav ")[1])
    deleteEncouragement(index)
    msg.channel.send("kali bava.")
  }

  if (msg.content.startsWith("$list")) {
    db.get("encouragements").then(encouragements => {
      msg.channel.send(encouragements)
    })
  }

  if (msg.content.startsWith("$responding")) {
    value = msg.content.split("$responding ")[1]

    if (value.toLowerCase() == "true") {
      db.set("responding", true)
      msg.channel.send("Responding is on.")
    } else {
       db.set("responding", false)
      msg.channel.send("Responding is off.")     
    }
  }

})

keepAlive()
client.login(process.env.TOKEN)