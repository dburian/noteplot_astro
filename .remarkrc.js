import remarkFrontmatter from 'remark-frontmatter';
import {visit, EXIT, SKIP} from 'unist-util-visit';
import path  from 'path';
import {toMarkdown} from 'mdast-util-to-markdown'
import inlineLinks from 'remark-inline-links';
import { mkdir, writeFile } from 'fs/promises';
import yaml from 'js-yaml';
import remarkMath from 'remark-math';

function printTree() {
  return function (tree) {
    console.dir(tree);
  }
};

function addToFrontmatter(tree, props) {
  let yamlNode = null;

  visit(tree, 'yaml', (node) => {
    yamlNode = node;

    return EXIT;
  })

  if (yamlNode === null) {
    yamlNode = {
      type: 'yaml',
      value: '',
    };

    tree.children = [
      yamlNode,
      ...tree.children,
    ]
  }

  const content = {
    ...yaml.load(yamlNode.value),
    ...props
  }

  yamlNode.value = yaml.dump(content);
}

function isURL(str) {
  try {
    return Boolean(new URL(str));
  } catch(e) {
    return false;
  }

}

function toSlug(fullFilePath, sourceRoot) {
  const slugPath = path.relative(sourceRoot, fullFilePath);
  return slugPath.slice(0, -path.extname(slugPath).length);
}

function addTitle() {
  return function (tree) {
    let firstHeading = undefined;

    visit(tree, 'heading', (node) => {
      firstHeading = node.children[0].value

      return EXIT
    })

    addToFrontmatter(tree, {title: firstHeading})
  }
}

function addSlug(originalRoot) {
  return function(tree, file) {
    const slug = toSlug(path.join(file.cwd, file.path), originalRoot);

    addToFrontmatter(tree, {slug})
  };
}

const backlinks = new Map();

function addLinks(originalRoot) {
  return (tree, file) => {
    const links = []
    const fileFullPath = path.join(file.cwd, file.path);

    visit(tree, 'link', (node) => {
      let linkDest = node.url;
      if (isURL(linkDest)) return SKIP;

      if (!path.isAbsolute(linkDest)) {
        const fileCwd = path.dirname(fileFullPath);
        // linkDest = path.relative(fileCwd, linkDest);
        linkDest = path.join(fileCwd, linkDest);
      }

      const slugLinkDest = toSlug(linkDest, originalRoot);

      links.push(slugLinkDest);

      if (!backlinks.has(slugLinkDest)) {
        backlinks.set(slugLinkDest, new Set());
      }

      backlinks.get(slugLinkDest).add(toSlug(fileFullPath,originalRoot));
    });

    addToFrontmatter(tree, {links});
  };
}

function addBacklinks(sourceRoot) {
  return (tree, file) => {
    const slug = toSlug(path.join(file.cwd, file.path), sourceRoot);
    addToFrontmatter(tree, {backlinks: [...backlinks.get(slug) || []]});
  };
}

function save({targetRoot, sourceRoot}) {
  return async (tree, file) => {
    const fileFullPath = path.join(file.cwd, file.path);
    const slugPath = path.relative(sourceRoot, fileFullPath);
    const savePath = path.join(targetRoot, slugPath);

    const fileString = toMarkdown(
      tree,
      {
        ...this.data('settings'),
        extensions: this.data('toMarkdownExtensions') || []
      }
    );

    const saveDir = path.dirname(savePath);
    await mkdir(saveDir, {recursive: true});
    await writeFile(savePath, fileString)
    console.info(`File ${file.path} saved to ${savePath}.`)
  };
}



const remarkConfig = {
  plugins: [
    [remarkFrontmatter, ['yaml']],
    [remarkMath],
    [inlineLinks],
    [addTitle],
    [addSlug, '/home/dburian/repos/notes'],
    [addLinks, '/home/dburian/repos/notes'],
    [addBacklinks, '/home/dburian/repos/notes'],
    // [printTree],
    [save, {targetRoot: path.join('src', 'content', 'notes'),  sourceRoot: '/home/dburian/repos/notes'}]
  ]
}

export default remarkConfig
