import Dexie, { type Table } from "dexie";
import type { Game } from "~/schemas/game";

class YagsDatabase extends Dexie {
  games!: Table<Game>;

  constructor() {
    super("YagsDatabase");

    this.version(1).stores({
      games: "&id, name",
    });
  }

  async exportData() {
    return {
      games: await this.games.toArray(),
    };
  }
}

const db = new YagsDatabase();

export { db };
