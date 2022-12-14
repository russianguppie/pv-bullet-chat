(() => {
  let opacity;
  let $iframe;
  let url = window.location.href;
  let src = chrome.extension.getURL("ui.html");
  window.addEventListener("message", function (e) {
    if (event.origin !== src.substring(0, src.length - "/ui.html".length)) {
      console.log("expect origin: " + src);
      console.log("unknow origin: " + event.origin);
      return;
    }
    switch (e.data["type"]) {
      case "opacity":
        opacity = e.data["value"];
        break;
      default:
        console.log("unknown data type");
    }
  });

  chrome.extension.onMessage.addListener(function (msg, sender, sendRes) {
    console.log(msg);
    switch (msg.type) {
      case "active":
        if ($("#bullet-frame").length !== 0) {
          break;
        }
        $iframe = $("<iframe>")
          .prop("src", src + "?url=" + url)
          .prop("id", "bullet-frame")
          .css({
            border: 0,
            position: "fixed",
            height: "500px",
            width: "300px",
            right: "-240px",
            bottom: "5%",
            "z-index": 20000,
          })
          .appendTo("body");
        $iframe.animate({ right: "1%" }, 600);
        break;
      case "pending":
        if ($("#bullet-frame").length === 0) {
          break;
        }
        $iframe.animate({ right: -$iframe.width() }, function () {
          $iframe.remove();
        });
        break;
      case "shot":
        shoot(msg.bullet);
        break;
      default:
        console.log(`unknow message type: ${msg.type}`);
    }
  });

  function sanitize(str) {
    if (sanitize.escape === undefined) {
      sanitize.escape = $("<textarea>")[0];
    }
    sanitize.escape.textContent = str;
    return sanitize.escape.innerHTML;
  }

  function shoot(bullet) {
      if (!shouldFilter(sanitize(bullet["content"]))) {
          saveToDB(sanitize(bullet["content"]));
          let $bullet = $("<span>")
              .prop("class", "bullet")
              .text(sanitize(bullet["content"]))
              .css({
                  position: "fixed",
                  top: bullet["position"],
                  color: bullet["color"],
                  "font-size": `${bullet["size"]}rem`,
                  opacity: opacity,
                  "white-space": "nowrap",
                  "z-index": 10000,
              })
              .appendTo("body");
          $bullet.css({right: -Math.floor(1.25 * $bullet.width()) + "px"});
          $bullet.animate(
              {right: "100%"},
              bullet["duration"],
              "linear",
              function () {
                  $(this).remove();
              }
          );
      }
  }


})();

// I know this is ugly. thhis is how to work around it:
// https://meet-martin.medium.com/using-javascript-es6-import-export-modules-in-chrome-extensions-f63a3a0d2736
// Can do it later after everyone pushes changes

const badWordsArray = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass",
    "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s",
    "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial",
    "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher",
    "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs",
    "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs",
    "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole",
    "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa",
    "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead",
    "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking",
    "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap",
    "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus",
    "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck",
    "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead",
    "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber",
    "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation",
    "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots",
    "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker",
    "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking",
    "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks",
    "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin",
    "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer",
    "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k",
    "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned",
    "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore",
    "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm",
    "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey",
    "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch",
    "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist",
    "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations",
    "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz",
    "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings",
    "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin",
    "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker",
    "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz",
    "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim",
    "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk",
    "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser",
    "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos",
    "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw",
    "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+",
    "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited",
    "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters",
    "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac",
    "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt",
    "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat",
    "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang",
    "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx", "netflix", "disney+"];

let swear_alert_arr = new Array;
let swear_alert_count = 0;

function reset_alert_count() {
    swear_alert_count = 0;
}

function shouldFilter(str) {

    reset_alert_count();
    for (let i = 0; i < badWordsArray.length; i++) {
        for (let j = 0; j < (str.length); j++) {
            const suspectedBadWord = str.substring(j, (j + badWordsArray[i].length))
            if (badWordsArray[i] == suspectedBadWord.toLowerCase()) {
                swear_alert_arr[swear_alert_count] = suspectedBadWord;
                swear_alert_count++;
            }
        }
    }
    let alert_text = '';
    for (let k = 1; k <= swear_alert_count; k++) {
        alert_text += '\n' + '(' + k + ')  ' + swear_alert_arr[k - 1];
    }
    if (swear_alert_count > 0) {
        alert('The message will not be sent!!!\nThe following illegal words were found:\n_______________________________\n'
            + alert_text + '\n_______________________________');
        return true
    } else {
        return false
    }
}

window.onload = reset_alert_count;

async function saveToDB(str) {
    const bulletRecord = {
        "user": "gali2",
        "message": str,
        "video": "prime video",
        "timeline": "00:00:00"
    }
    const response = await fetch('http://localhost:8080/', {
        method: 'POST',
        body: JSON.stringify(bulletRecord), // string or object
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(error =>console.log(error));
    const myJson = await response.json(); //extract JSON from the http response
    console.log(myJson)

}

