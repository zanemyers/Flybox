interface CardProps {
  icon: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

function SlimCard(props: CardProps) {
  return (
    // Slim / Horizontal Card
    <div className="row g-4 mt-2">
      <div className="col-12">
        <div className="card border-dashed shadow-sm">
          <div className="card-body d-flex align-items-center justify-content-between">
            {/* Left side: Icon + Text  */}
            <div className="d-flex align-items-center">
              <div className="me-3 display-5">{props.icon}</div>
              <div>
                <h5 className="card-title mb-1">{props.title}</h5>
                <p className="card-text small mb-0">{props.description}</p>
              </div>
            </div>
            {/*  Right side: Button */}
            <a href={props.link} className="btn btn-outline-secondary">
              {props.buttonText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function NormalCard(props: CardProps) {
  return (
    // Normal Card
    <div className="col-md-6 mb-3">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <div className="mb-3 display-1">{props.icon}</div>
          <h5 className="card-title">{props.title}</h5>
          <p className="card-text">{props.description}</p>
          <a href={props.link} className="btn btn-primary">
            {props.buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}

interface Props extends CardProps {
  slim?: boolean; // defaults to false
}

export function Card({ slim, ...cardProps }: Props) {
  return slim ? <SlimCard {...cardProps} /> : <NormalCard {...cardProps} />;
}
