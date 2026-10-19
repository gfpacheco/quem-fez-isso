import { answerFor, answerIds, bothSidesId, type AnswerId, type Quote } from "@/data/types";

export const roundSize = 10;
export const bothSidesRange = { min: 1, max: 3 };
export const perSideRange = { min: 3, max: 5 };

type Pools = Record<AnswerId, Quote[]>;

type Counts = Record<AnswerId, number>;

type PickRoundOptions = {
  quotes: Quote[];
  seenIds: ReadonlySet<string>;
  random?: () => number;
  size?: number;
};

export function pickRound({ quotes, seenIds, random = Math.random, size = roundSize }: PickRoundOptions) {
  // True when every quote had already been seen, so the caller should clear its history
  const resetSeen = quotes.length > 0 && quotes.every((quote) => seenIds.has(quote.id));
  const effectiveSeen = resetSeen ? new Set<string>() : seenIds;
  const pools = buildPools(quotes, effectiveSeen, random);
  const quotas = pickQuotas(size, random);
  const picked: Quote[] = [];
  fillUpTo(picked, pools, size, (id) => quotas[id]);
  // A pool may be short of its quota, so the others absorb the slack within their range
  fillUpTo(picked, pools, size, (id) => rangeFor(id).max);
  // Only reached when the dataset is too small to respect the balance
  fillUpTo(picked, pools, size, () => Infinity);

  return { quotes: shuffle(picked, random), resetSeen };
}

function rangeFor(id: AnswerId) {
  return id === bothSidesId ? bothSidesRange : perSideRange;
}

/** Random per-answer quota within each range, adding up to `size` when the ranges allow it */
function pickQuotas(size: number, random: () => number) {
  const quotas = Object.fromEntries(answerIds.map((id) => [id, rangeFor(id).min])) as Counts;
  let assigned = answerIds.reduce((sum, id) => sum + quotas[id], 0);

  while (assigned < size) {
    const open = answerIds.filter((id) => quotas[id] < rangeFor(id).max);

    if (open.length === 0) {
      break;
    }

    quotas[open[Math.floor(random() * open.length)]] += 1;
    assigned += 1;
  }

  return quotas;
}

/** One queue per answer, unseen quotes first, each tier shuffled */
function buildPools(quotes: Quote[], seenIds: ReadonlySet<string>, random: () => number) {
  return {
    lula: tieredPool(quotes.filter((quote) => quote.politician === "lula"), seenIds, random),
    bolsonaro: bolsonaroPool(quotes, seenIds, random),
    ambos: tieredPool(quotes.filter((quote) => quote.politician === bothSidesId), seenIds, random),
  } satisfies Pools;
}

function tieredPool(own: Quote[], seenIds: ReadonlySet<string>, random: () => number) {
  const unseen = own.filter((quote) => !seenIds.has(quote.id));
  const seen = own.filter((quote) => seenIds.has(quote.id));

  return [...shuffle(unseen, random), ...shuffle(seen, random)];
}

/** Jair and Flávio share one answer, so their queue alternates between them to keep both represented */
function bolsonaroPool(quotes: Quote[], seenIds: ReadonlySet<string>, random: () => number) {
  const jair = tieredPool(quotes.filter((quote) => quote.politician === "jair"), seenIds, random);
  const flavio = tieredPool(quotes.filter((quote) => quote.politician === "flavio"), seenIds, random);
  const [first, second] = random() < 0.5 ? [jair, flavio] : [flavio, jair];

  return interleave(first, second);
}

/** Round-robin over the pools, unseen quotes before seen ones, honoring a per-answer cap */
function fillUpTo(picked: Quote[], pools: Pools, size: number, capFor: (id: AnswerId) => number) {
  const counts = countByAnswer(picked);
  let progressed = true;

  while (picked.length < size && progressed) {
    progressed = false;

    for (const id of answerIds) {
      if (picked.length >= size || counts[id] >= capFor(id) || pools[id].length === 0) {
        continue;
      }

      picked.push(pools[id].shift()!);
      counts[id] += 1;
      progressed = true;
    }
  }
}

function countByAnswer(quotes: Quote[]) {
  const counts = Object.fromEntries(answerIds.map((id) => [id, 0])) as Counts;

  for (const quote of quotes) {
    counts[answerFor(quote.politician)] += 1;
  }

  return counts;
}

function interleave<T>(a: T[], b: T[]) {
  const result: T[] = [];
  const length = Math.max(a.length, b.length);

  for (let i = 0; i < length; i++) {
    if (i < a.length) {
      result.push(a[i]);
    }

    if (i < b.length) {
      result.push(b[i]);
    }
  }

  return result;
}

function shuffle<T>(items: T[], random: () => number) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
