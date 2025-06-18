export const getTraitMessage = (score: number, trait: string): string => {
  if (score <= 5) {
    switch (trait) {
      case "O":
        return "You prefer the familiar and thrive in routines. Novelty isn't your thing.";
      case "C":
        return "You often go with the flow and avoid rigid structures.";
      case "E":
        return "You are reserved and introspective, valuing solitude deeply.";
      case "A":
        return "You value logic over emotions and aren't easily swayed.";
      case "N":
        return "You are very emotionally steady and rarely overwhelmed.";
    }
  } else if (score <= 10) {
    switch (trait) {
      case "O":
        return "You’re practical and prefer proven methods over experiments.";
      case "C":
        return "You're laid-back and not overly concerned with details.";
      case "E":
        return "You enjoy calm over chaos and avoid the spotlight.";
      case "A":
        return "You balance social harmony with honesty, sometimes being blunt.";
      case "N":
        return "You stay composed under stress and manage emotions well.";
    }
  } else if (score <= 15) {
    switch (trait) {
      case "O":
        return "You have a good balance of creativity and realism.";
      case "C":
        return "You are dependable but flexible when needed.";
      case "E":
        return "You enjoy both company and solitude equally.";
      case "A":
        return "You are kind and cooperative, with healthy boundaries.";
      case "N":
        return "You sometimes feel intense emotions but can manage them.";
    }
  } else if (score <= 20) {
    switch (trait) {
      case "O":
        return "You’re imaginative, curious, and enjoy exploring new ideas.";
      case "C":
        return "You are focused, responsible, and goal-driven.";
      case "E":
        return "You are energetic, enthusiastic, and love engaging with others.";
      case "A":
        return "You are highly empathetic and easily connect with people.";
      case "N":
        return "You are sensitive and often feel emotions deeply.";
    }
  } else {
    switch (trait) {
      case "O":
        return "Your mind is a creative universe. You constantly seek novelty.";
      case "C":
        return "You are exceptionally disciplined and detail-oriented.";
      case "E":
        return "You are the life of every room — sociable and dynamic.";
      case "A":
        return "You are a peacemaker — compassionate and deeply considerate.";
      case "N":
        return "You feel emotions at a high intensity, which can be both a gift and a challenge.";
    }
  }

  return "";
};
