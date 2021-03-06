import type { Context } from './Context';

import Builder from './Builder';
import * as emd from 'ecmarkdown';
import Grammar from './Grammar';

/*@internal*/
export default class Algorithm extends Builder {
  static enter(context: Context) {
    const { node } = context;
    // Need to process emu-grammar elements first so emd doesn't trash the syntax inside emu-grammar nodes
    const grammarNodes = node.querySelectorAll('emu-grammar');
    for (let i = 0; i < grammarNodes.length; i++) {
      let gn = grammarNodes[i];
      context.node = gn as HTMLElement;
      Grammar.enter(context);
      Grammar.exit(context);
      context.node = node;
    }
    // replace spaces after !/? with &nbsp; to prevent bad line breaking
    const html = emd
      .algorithm(node.innerHTML)
      .replace(/((?:\s+|>)[!?])\s+(\w+\s*\()/g, '$1&nbsp;$2');
    node.innerHTML = html;
    context.inAlg = true;
  }

  static exit(context: Context) {
    context.inAlg = false;
  }
  static elements = ['EMU-ALG'];
}
