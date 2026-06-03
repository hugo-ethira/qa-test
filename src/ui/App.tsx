import { useMemo, useState } from 'react';
import { GildedRose, Item } from '@/gilded-rose';

interface DraftItem {
  name: string;
  sellIn: string;
  quality: string;
}

const emptyDraft: DraftItem = { name: '', sellIn: '', quality: '' };

function seedInventory(): Item[] {
  return [
    new Item('+5 Dexterity Vest', 10, 20),
    new Item('Aged Brie', 2, 0),
    new Item('Elixir of the Mongoose', 5, 7),
    new Item('Sulfuras, Hand of Ragnaros', 0, 80),
    new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
    new Item('Conjured Mana Cake', 3, 6),
  ];
}

function cloneItems(items: Item[]): Item[] {
  return items.map((it) => new Item(it.name, it.sellIn, it.quality));
}

export function App() {
  const [items, setItems] = useState<Item[]>(() => seedInventory());
  const [day, setDay] = useState(0);
  const [draft, setDraft] = useState<DraftItem>(emptyDraft);
  const [error, setError] = useState<string | null>(null);

  const canAdd = useMemo(
    () =>
      draft.name.trim().length > 0 &&
      draft.sellIn.trim().length > 0 &&
      draft.quality.trim().length > 0,
    [draft],
  );

  function advanceDay() {
    const next = new GildedRose(cloneItems(items)).updateQuality();
    setItems(next);
    setDay((d) => d + 1);
  }

  function resetInventory() {
    setItems(seedInventory());
    setDay(0);
    setError(null);
  }

  function addItem(event: React.FormEvent) {
    event.preventDefault();
    const sellIn = Number(draft.sellIn);
    const quality = Number(draft.quality);
    if (!Number.isFinite(sellIn) || !Number.isFinite(quality)) {
      setError('SellIn and Quality must be numbers.');
      return;
    }
    if (quality < 0 || quality > 50) {
      setError('Quality must be between 0 and 50.');
      return;
    }
    setItems((prev) => [...prev, new Item(draft.name.trim(), sellIn, quality)]);
    setDraft(emptyDraft);
    setError(null);
  }

  return (
    <main className="app">
      <header>
        <h1>Gilded Rose Inventory</h1>
        <p className="day" data-testid="day-counter">
          Day {day}
        </p>
      </header>

      <section className="controls">
        <button type="button" data-testid="advance-day" onClick={advanceDay}>
          Advance Day
        </button>
        <button type="button" data-testid="reset" onClick={resetInventory}>
          Reset
        </button>
      </section>

      <table data-testid="inventory">
        <thead>
          <tr>
            <th>Name</th>
            <th>SellIn</th>
            <th>Quality</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.name}-${index}`} data-testid="inventory-row">
              <td data-testid="item-name">{item.name}</td>
              <td data-testid="item-sellin">{item.sellIn}</td>
              <td data-testid="item-quality">{item.quality}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="add-item">
        <h2>Add Item</h2>
        <form onSubmit={addItem}>
          <input
            type="text"
            placeholder="Name"
            aria-label="Name"
            data-testid="new-name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="SellIn"
            aria-label="SellIn"
            data-testid="new-sellin"
            value={draft.sellIn}
            onChange={(e) => setDraft({ ...draft, sellIn: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quality"
            aria-label="Quality"
            data-testid="new-quality"
            value={draft.quality}
            onChange={(e) => setDraft({ ...draft, quality: e.target.value })}
          />
          <button type="submit" data-testid="add-item" disabled={!canAdd}>
            Add
          </button>
        </form>
        {error && (
          <p className="error" role="alert" data-testid="error">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
