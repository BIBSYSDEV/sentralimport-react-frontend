import React, { FC, useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { CircularProgress, Typography } from '@material-ui/core';
import { Context } from '../../Context';
import CommonErrorMessage from '../CommonErrorMessage';
import styled from 'styled-components';
import { getParentsUnitName, searchForInstitutionsByName } from '../../api/institutionApi';
import { handlePotentialExpiredSession } from '../../api/api';
import { SearchLanguage } from '../../api/contributorApi';

const StyledCircularProgress = styled(CircularProgress)`
  margin: 0.5rem;
`;

const StyledUnitSelectWrapper = styled.div`
  margin-top: 0.5rem;
`;

const StyledLabelTypography = styled(Typography)`
  && {
    font-size: 1.2rem;
  }
  margin-bottom: 1rem;
`;

const StyledLabel = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface InstitutionCountrySelectProps {
  selectedInstitution: any;
  handleInstitutionChange: any;
  unit: any;
  handleUnitChange: any;
}

const InstitutionCountrySelect: FC<InstitutionCountrySelectProps> = ({
  selectedInstitution,
  handleInstitutionChange,
  unit,
  handleUnitChange,
}) => {
  const { state } = useContext(Context);
  const [units, setUnits] = useState<any>([]);
  const [loadingError, setLoadingError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [searchingForPlaces, setSearchingForPlaces] = useState(false);
  const [searchingForPlacesError, setSearchingForPlacesError] = useState<Error | undefined>();
  const [groupOptions, setGroupOptions] = useState([
    { label: 'Cristin-institusjoner', options: state.institutionsEnglish },
    { label: 'Annet', options: [] },
  ]);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoadingError('');
      if (selectedInstitution.cristinInstitutionNr && selectedInstitution.cristinInstitutionNr !== 0) {
        try {
          setLoadingUnits(true);
          const parentUnitNamesResponse = await getParentsUnitName(
            selectedInstitution.cristinInstitutionNr,
            SearchLanguage.En
          );
          const units = parentUnitNamesResponse.data.map((parentUnitName) => ({
            label: parentUnitName.unit_name.en ?? parentUnitName.unit_name.nb,
            value: parentUnitName.cristin_unit_id,
          }));
          setUnits(units);
        } catch (err) {
          setLoadingError('Kunne ikke laste enheter');
        } finally {
          setLoadingUnits(false);
        }
      }
    };
    setUnits([]);
    fetchUnits().then();
  }, [inputValue, selectedInstitution]);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (inputValue !== '') {
        setSearchingForPlacesError(undefined);
        setSearchingForPlaces(true);
        try {
          const institutionsResponse = await searchForInstitutionsByName(inputValue, SearchLanguage.En);
          const places = institutionsResponse.data.map((institution) => ({
            value: institution.acronym,
            label: institution.institution_name.en ?? institution.institution_name.nb,
            cristinInstitutionNr: institution.cristin_institution_id,
          }));
          setGroupOptions([
            { label: 'Cristin-institusjoner', options: state.institutionsEnglish },
            { label: 'Annet', options: places },
          ]);
        } catch (error) {
          if (error instanceof Error) {
            handlePotentialExpiredSession(error);
            setSearchingForPlacesError(error);
          }
        } finally {
          setSearchingForPlaces(false);
        }
      }
    };
    fetchPlaces().then();
  }, [inputValue]);

  return (
    <div>
      <StyledLabel>
        <StyledLabelTypography gutterBottom>Søk etter institusjon:</StyledLabelTypography>
        {searchingForPlaces && <CircularProgress size={'1rem'} />}
      </StyledLabel>

      {!searchingForPlaces && searchingForPlacesError && (
        <Typography color="error">Søket på institusjon feilet.</Typography>
      )}
      <Select
        placeholder="Søk på institusjoner eller sted"
        name="institutionSelect"
        options={groupOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleInstitutionChange}
        onInputChange={(event) => {
          setInputValue(event);
        }}
        aria-label="Institusjonsvelger"
        value={selectedInstitution}
      />
      {loadingUnits && <StyledCircularProgress size={'1rem'} />}
      {loadingError && <CommonErrorMessage datatestid="institution-country-select-error" errorMessage={loadingError} />}
      {units.length > 0 ? (
        <StyledUnitSelectWrapper>
          <Select
            placeholder="Søk på enheter"
            name="unitSelect"
            options={units}
            value={unit}
            onChange={handleUnitChange}
            isClearable
          />
        </StyledUnitSelectWrapper>
      ) : (
        selectedInstitution &&
        !loadingUnits && <Typography variant="caption">Institusjonen har ingen enheter</Typography>
      )}
    </div>
  );
};

export default InstitutionCountrySelect;
