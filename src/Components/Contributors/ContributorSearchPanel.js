import React from 'react';
import { Button, Card, Collapse } from '@material-ui/core';

export default function ContributorSearchPanel(props) {
  if (props.data !== '') {
    return (
      <Collapse in={props.collapsed}>
        <Card className="contributor-suggestions">
          <div>
            {props.data.map((author, i) => (
              <span key={i}>
                <div className="author">
                  {(author.hasOwnProperty('first_name_preferred') ? author.first_name_preferred : author.first_name) +
                    ' ' +
                    (author.hasOwnProperty('surname_preferred') ? author.surname_preferred : author.surname)}{' '}
                </div>
                {author.affiliations.map((affiliation, h) => (
                  <div key={h} className="affiliations">
                    {' '}
                    {affiliation.institutionName}
                    {affiliation.hasOwnProperty('units')
                      ? affiliation.units.map((unit, i) => (
                          <div key={i} className="units">
                            {' '}
                            &bull; {unit.unitName}{' '}
                          </div>
                        ))
                      : ''}
                  </div>
                ))}
                <Button key={i} color="primary" onClick={() => props.handleChoose(author)} className="select-button">
                  Velg denne
                </Button>
                <hr />
              </span>
            ))}
          </div>
          <Button color="primary" onClick={props.handleAbort}>
            Lukk
          </Button>
        </Card>
      </Collapse>
    );
  } else {
    return null;
  }
}
