import Dexie, { type Table } from "dexie";
import type { Game } from "~/schemas/game";

class YagsDatabase extends Dexie {
  games!: Table<Game>;

  constructor() {
    super("YagsDatabase");

    this.generateDb();
  }

  async exportData() {
    return {
      games: await this.games.toArray(),
    };
  }

  async reset() {
    await this.delete();
    this.generateDb();
    await this.open();
  }

  private generateDb() {
    this.version(1).stores({
      games: "&id, name",
    });
  }
}

const db = new YagsDatabase();

export { db };
