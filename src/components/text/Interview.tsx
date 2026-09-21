import type { ReactNode } from "react";

import type { Interview as InterviewData } from "@/content/types";

export interface InterviewProps {
  heading: string;
  interview: InterviewData;
}

function renderInlineEmphasis(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((segment, index) => {
    if (segment.startsWith("*") && segment.endsWith("*")) {
      return <em key={index}>{segment.slice(1, -1)}</em>;
    }

    return segment;
  });
}

export function Interview({ heading, interview }: InterviewProps) {
  const { intro, initials, parts, closing, signature } = interview;

  return (
    <section id="rozmowa" className="interview-section workshop-section scroll-mt-space-6">
      <h2 className="workshop-section-heading">{heading}</h2>
      <p className="interview-intro">{intro}</p>

      {parts.map((part, partIndex) => (
        <div key={part.id} className={partIndex > 0 ? "interview-part interview-part--spaced" : "interview-part"}>
          <h3 id={part.id} className="interview-part-title scroll-mt-space-6">
            {part.title}
          </h3>

          {part.exchanges.map((exchange, exchangeIndex) => (
            <div key={`${part.id}-${exchangeIndex}`} className="interview-exchange">
              <div className="interview-turn interview-turn--question">
                <span className="interview-initial interview-initial--asker" aria-hidden="true">
                  {initials.asker}
                </span>
                <p className="interview-question">{exchange.q}</p>
              </div>
              <div className="interview-turn interview-turn--answer">
                <span className="interview-initial interview-initial--answerer" aria-hidden="true">
                  {initials.answerer}
                </span>
                <p className="interview-answer">{renderInlineEmphasis(exchange.a)}</p>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="interview-exchange interview-exchange--closing">
        <div className="interview-turn interview-turn--question">
          <span className="interview-initial interview-initial--asker" aria-hidden="true">
            {initials.asker}
          </span>
          <p className="interview-question">{closing}</p>
        </div>
      </div>

      <p className="interview-signature">{signature}</p>
    </section>
  );
}
