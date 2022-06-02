import { marked } from "marked";
import Highlight, { defaultProps } from "prism-react-renderer";
import { renderToStaticMarkup } from "react-dom/server";
import shadesOfPurple from "prism-react-renderer/themes/shadesOfPurple";
import vsDark from "prism-react-renderer/themes/vsDark";

const renderer = new marked.Renderer();
function getTextClass(level) {
  switch (level) {
    case 6:
      return "text-lg";
    case 5:
      return "text-xl";
    case 4:
      return "text-2xl";
    case 3:
      return "text-3xl";
    case 2:
      return "text-4xl";
    case 1:
      return "text-5xl";
    default:
      return "text-base";
  }
}
renderer.heading = (text, level, raw, slugger) => {
  const id = slugger.slug(text);
  const Component = `h${level}`;

  return renderToStaticMarkup(
    <Component id={id} className={getTextClass(level)}>
      <a  
        href={`#${id}`}
        className="pointer-events-auto"
        dangerouslySetInnerHTML={{ __html: text }}
      ></a>
    </Component>
  );
};

renderer.link = (href, _, text) =>
  `<a href=${href} target="_blank" rel="noopener noreferrer"">${text}</a>`;

renderer.checkbox = () => "";
renderer.listitem = (text, task, checked) => {
  if (task) {
    return `<li><span class="check">&#8203;<input type="checkbox" disabled ${
      checked ? "checked" : ""
    } /></span><span>${text}</span></li>`;
  }

  return `<li>${text}</li>`;
};
renderer.code = (code, options) => {
  const opts = options.split(" ").map((o) => o.trim());
  const language = opts[0];
  const highlight = opts
    .filter((o) => o.startsWith("highlight="))
    .pop()
    ?.replace("highlight=", "")
    .trim();

  return renderToStaticMarkup(
    <Code language={language} code={code} highlight={highlight} />
  );
};

marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  renderer,
});
let theme = vsDark;
export default (markdown, isPreferDark) => {
  theme = isPreferDark ? shadesOfPurple : vsDark;
  return marked(markdown);
};

const Code = ({ code, language, highlight, ...props }) => {
  if (!language)
    return <code {...props} dangerouslySetInnerHTML={{ __html: code }} />;
  const highlightedLines = highlight
    ? highlight.split(",").reduce((lines, h) => {
        if (h.includes("-")) {
          // Expand ranges like 3-5 into [3,4,5]
          const [start, end] = h.split("-").map(Number);
          const x = Array(end - start + 1)
            .fill()
            .map((_, i) => i + start);
          return [...lines, ...x];
        }

        return [...lines, Number(h)];
      }, [])
    : [];
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={code.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div
              key={i}
              {...getLineProps({ line, key: i })}
              style={
                highlightedLines.includes(i + 1)
                  ? {
                      background: "rgba(255,255,255,0.1)",
                      margin: "0 -1rem",
                      padding: "0 1rem",
                      display: "table-row",
                    }
                  : { display: "table-row" }
              }
            >
              <span
                style={{
                  display: "table-cell",
                  textAlign: "right",
                  padding: "0 2rem 0 0.5rem",
                  userSelect: "none",
                  opacity: 0.5,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  display: "table-cell",
                }}
              >
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
