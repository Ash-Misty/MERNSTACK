const pastelClasses = [
  "pastel-pink",
  "pastel-blue",
  "pastel-green",
  "pastel-yellow",
  "pastel-lavender",
  "pastel-peach",
  "pastel-mint",
  "pastel-coral",
];

export function getRandomPastelClass(seed?: string): string {
  if (seed) {
    // Use seed for consistent color per contact
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % pastelClasses.length;
    return pastelClasses[index];
  }
  return pastelClasses[Math.floor(Math.random() * pastelClasses.length)];
}
