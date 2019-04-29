# mdx-paper

Write an article using Markdown and React components ([MDX](https://mdxjs.com/)).

## Install

```sh
npm install mdx-paper
```

## Usage

1. Write your article in `article.mdx`.
1. Import React components from `mdx-paper` or elsewhere.
1. Add the article's metadata to `metadata.yml`.
1. Run `npx mdx-paper` to start a web server and view the article.
1. Run `npx mdx-paper build` to build the article for deployment, in the `dist` folder.

### References

1. Add a references file as either BibTex, CiteProc JSON or CiteProc YML and use e.g. `--references references.bib` to specify the path.
1. Specify a [CSL citation style](https://citationstyles.org/authors/) with `--citation-style`, e.g. `--citation-style nature`.
1. Use `import { Bibliography } from 'mdx-paper'` and place `<Bibliography/>` where you'd like the reference list to appear.

### Publishing

1. To automatically build and deploy the article to [Zeit Now](https://zeit.co/now) add a `now.json` file and either connect the [Now for GitHub](https://zeit.co/github) application or run `now` locally.


## Examples

* [A simple example](https://github.com/hubgit/mdx-paper-example)


