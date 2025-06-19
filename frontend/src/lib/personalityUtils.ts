export const getTraitMessage = (score: number, trait: string): string => {
  if (score <= 5) {
    switch (trait) {
      case "O":
        return "You feel safest in the known. Change can feel unsettling, and that's okay.";
      case "C":
        return "You go with the flow and avoid strict routines. Structure isn’t your thing.";
      case "E":
        return "You're quiet and prefer your own space. Crowds can feel draining.";
      case "A":
        return "You value facts over feelings and don’t sugarcoat things.";
      case "N":
        return "You're calm and steady, even when life gets tough.";
    }
  } else if (score <= 10) {
    switch (trait) {
      case "O":
        return "You're practical. You like ideas that are proven and clear.";
      case "C":
        return "You're chill and relaxed. Deadlines might slip, but you stay cool.";
      case "E":
        return "You like peace and avoid too much noise. Quiet wins over chaos.";
      case "A":
        return "You're honest, even if it ruffles feathers. You respect truth.";
      case "N":
        return "You handle pressure well and bounce back quickly.";
    }
  } else if (score <= 15) {
    switch (trait) {
      case "O":
        return "You mix imagination with common sense. A rare balance.";
      case "C":
        return "You're reliable, but not rigid. You know when to bend.";
      case "E":
        return "You enjoy people, but also value time alone.";
      case "A":
        return "You’re kind and fair, with healthy personal boundaries.";
      case "N":
        return "You feel deeply sometimes, but know how to steady yourself.";
    }
  } else if (score <= 20) {
    switch (trait) {
      case "O":
        return "You're curious and love exploring new ideas.";
      case "C":
        return "You’re focused and committed. Goals matter to you.";
      case "E":
        return "You bring energy to every room. People notice your vibe.";
      case "A":
        return "You're warm and empathetic. You care, deeply.";
      case "N":
        return "You're sensitive and feel things strongly. It's part of your depth.";
    }
  } else {
    switch (trait) {
      case "O":
        return "Your mind is a playground of ideas. You crave the new.";
      case "C":
        return "You’re a machine of discipline. Details are your thing.";
      case "E":
        return "You light up rooms. Social energy fuels you.";
      case "A":
        return "You’re deeply compassionate. You bring peace where there’s noise.";
      case "N":
        return "Your emotions run deep — it’s both powerful and personal.";
    }
  }

  return "";
};
