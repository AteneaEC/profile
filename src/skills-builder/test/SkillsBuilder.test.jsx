import { IntlProvider } from '@edx/frontend-platform/i18n';
import React from 'react';
import {
  screen, render, cleanup, fireEvent, act,
} from '@testing-library/react';
import { mergeConfig } from '@edx/frontend-platform';
import { SkillsBuilder } from '..';
import { SkillsBuilderModal } from '../skills-builder-modal';
import { SkillsBuilderProvider, SkillsBuilderContext } from '../skills-builder-context';
import { skillsInitialState } from '../data/reducer';
import { mockData } from './__mocks__/jobSkills.mockData';
import { getProductRecommendations, searchJobs, useAlgoliaSearch } from '../utils/search';

const dispatchMock = jest.fn();

jest.mock('@edx/frontend-platform/logging');

jest.mock('react-instantsearch-hooks-web', () => ({
  // eslint-disable-next-line react/prop-types
  InstantSearch: ({ children }) => (<div>{children}</div>),
  useSearchBox: jest.fn(() => ({ refine: jest.fn() })),
  useHits: jest.fn(() => ({ hits: mockData.hits })),
}));

jest.mock('../utils/search', () => ({
  searchJobs: jest.fn(),
  getProductRecommendations: jest.fn(),
  useAlgoliaSearch: jest.fn(),
}));

searchJobs.mockReturnValue(mockData.searchJobs);
getProductRecommendations.mockReturnValue(mockData.productRecommendations);
useAlgoliaSearch.mockReturnValue(mockData.useAlgoliaSearch);

const contextValue = {
  state: {
    ...skillsInitialState,
  },
  dispatch: dispatchMock,
  algolia: {
    // Without this, tests would fail to destructure `searchClient` in the <JobTitleSelect> component
    searchClient: {},
    productSearchIndex: {},
    jobSearchIndex: {},
  },
};

const SkillsBuilderWrapperWithContext = (value) => (
  <IntlProvider locale="en">
    <SkillsBuilderContext.Provider value={value}>
      <SkillsBuilderModal />
    </SkillsBuilderContext.Provider>
  </IntlProvider>
);

describe('skills-builder', () => {
  beforeAll(async () => {
    await mergeConfig({
      ALGOLIA_JOBS_INDEX_NAME: 'test-job-index-name',
    });
  });
  beforeEach(() => cleanup());

  it('should render a Skills Builder modal with a prompt for the user', () => {
    act(() => {
      render(
        <IntlProvider locale="en">
          <SkillsBuilderProvider>
            <SkillsBuilder />
          </SkillsBuilderProvider>
        </IntlProvider>,
      );
    });
    expect(screen.getByText('Skills Builder')).toBeTruthy();
    expect(screen.getByText('First, tell us what you want to achieve')).toBeTruthy();
  });

  it('should render the second prompt if a goal is selected', () => {
    render(
      SkillsBuilderWrapperWithContext(
        {
          ...contextValue,
          state: {
            ...contextValue.state,
            currentGoal: 'I want to start my career',
          },
        },
      ),
    );
    const expectedGoal = {
      payload: 'I want to advance my career',
      type: 'SET_GOAL',
    };
    const expectedJobTitle = {
      payload: 'Student',
      type: 'SET_CURRENT_JOB_TITLE',
    };

    const goalSelect = screen.getByTestId('goal-select-dropdown');
    fireEvent.change(goalSelect, { target: { value: 'I want to advance my career' } });

    const checkbox = screen.getByRole('checkbox', { name: 'I\'m a student' });
    fireEvent.click(checkbox);

    expect(screen.getByText('Next, search and select your current job title')).toBeTruthy();
    expect(dispatchMock).toHaveBeenCalledWith(expectedGoal);
    expect(dispatchMock).toHaveBeenCalledWith(expectedJobTitle);
  });

  it('should render the third prompt if a current job title is selected', () => {
    render(
      SkillsBuilderWrapperWithContext(
        {
          ...contextValue,
          state: {
            ...contextValue.state,
            currentGoal: 'I want to start my career',
            currentJobTitle: 'Goblin Guide',
          },
        },
      ),
    );
    expect(screen.getByText('What careers are you interested in?')).toBeTruthy();
  });

  it('should render a <CareerInterestCard> for each career interest', () => {
    render(
      SkillsBuilderWrapperWithContext(
        {
          ...contextValue,
          state: {
            ...contextValue.state,
            currentGoal: 'I want to start my career',
            currentJobTitle: 'Goblin Lackey',
            careerInterests: ['Prospector', 'Mirror Breaker', 'Bombardment'],
          },
        },
      ),
    );
    expect(screen.getByText('Prospector')).toBeTruthy();
    expect(screen.getByText('Mirror Breaker')).toBeTruthy();
    expect(screen.getByText('Bombardment')).toBeTruthy();
  });

  it('should remove a <CareerInterestCard> when the corresponding close button is selected', () => {
    render(
      SkillsBuilderWrapperWithContext(
        {
          ...contextValue,
          state: {
            ...contextValue.state,
            currentGoal: 'I want to start my career',
            currentJobTitle: 'Goblin Lackey',
            careerInterests: ['Prospector', 'Mirror Breaker', 'Bombardment'],
          },
        },
      ),
    );

    const expected = {
      payload: 'Prospector',
      type: 'REMOVE_CAREER_INTEREST',
    };

    fireEvent.click(screen.getByLabelText('Remove career interest: Prospector'));
    expect(dispatchMock).toHaveBeenCalledWith(expected);
  });

  it('should render a <JobSillsSelectableBox> for each career interest the learner has submitted', async () => {
    render(
      SkillsBuilderWrapperWithContext(
        {
          ...contextValue,
          state: {
            ...contextValue.state,
            currentGoal: 'I want to start my career',
            currentJobTitle: 'Goblin Lackey',
            careerInterests: ['Prospector'],
          },
        },
      ),
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Next Step' }));
    });

    const chipComponents = document.querySelectorAll('.pgn__chip');
    expect(chipComponents[0].textContent).toEqual('finding shiny things');
    expect(chipComponents[1].textContent).toEqual('mining');

    expect(screen.getByText('Prospector')).toBeTruthy();
  });
});
