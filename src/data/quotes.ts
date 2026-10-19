import type { Quote } from "./types";
import ambos from "./quotes/ambos.json";
import flavio from "./quotes/flavio.json";
import jair from "./quotes/jair.json";
import lula from "./quotes/lula.json";

export const allQuotes = [...lula, ...jair, ...flavio, ...ambos] as Quote[];
