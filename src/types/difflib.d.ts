declare module "difflib" {
  type Match = [number, number, number];
  type Opcode = [string, number, number, number, number];
  type JunkFunc = (param: string) => boolean;
  interface Options {
    fromfile?: string;
    tofile?: string;
    fromfiledate?: string;
    tofiledate?: string;
    n?: number;
    lineterm?: string;
  }

  // function _calculateRatio(matches: Match[], length: Number): Number;
  // function _arrayCmp<T>(a: T[], b: T[]): Number;

  // class SequenceMatcher {
  //   name: "SequenceMatcher";
  //   constructor(
  //     isjunk: boolean,
  //     a?: string,
  //     b?: string,
  //     autojunk?: boolean
  //   );
  //   setSeqs(a: ArgType<setSeq1>, b: seq2): rettype<seq2>;
  //   setSeq1(a: string): null;
  //   setSeq2(b: string): rettype<_chainB>;
  //   findLongestMatch(alo: number, ahi: number, blo: number, bhi: number): Match;
  //   getMatchingBlocks(): Match[];
  //   getOpcodes(): Opcode[];
  //   getGroupedOpcodes(n: number | null): Opcode[][];
  //   ratio(): number;
  //   quickRatio(): number;
  //   realQuickRatio(): number;
  // }

  function getCloseMatches(
    word: string,
    possibilities: string[],
    n?: number,
    cutoff?: number
  ): string[];
  function _countLeading(line: string, ch: string): number;
  // class Differ {
  //   name: "Differ";
  //   constructor(linejunk: JunkFunc | null, charjunk: JunkFunc | null);
  //   compare(a: string[], b: string[]): string[];
  //   //_dump(tag, x, lo, hi);
  //   // _plainReplace(a, alo, ahi, b, blo, bhi);
  //   // _fancyReplace(a, alo, ahi, b, blo, bhi);
  //   // _fancyHelper(a, alo, ahi, b, blo, bhi);
  //   // _qformat(aline, bline, atags, btags);
  // }
  function IS_LINE_JUNK(line: string, pat?: Regexp): Regexp.test;
  function IS_CHARACTER_JUNK(ch: string, ws?: string): boolean;
  // function _formatRangeUnified(start, stop);
  function unifiedDiff(a: string[], b: string[], _arg?: Options): string[];
  // function _formatRangeContext(start, stop);
  function contextDiff(a: string[], b: string[], _arg?: Options): string[];
  function ndiff(
    a: string[],
    b: string[],
    linejunk?: JunkFunc,
    charjunk?: JunkFunc
  ): string[];
  function restore(delta: string[], which: number): string[];
}
