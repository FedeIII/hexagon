import PropTypes from 'prop-types';

const Repositories = {
  ...PropTypes,
};

export default Repositories;

export function checkPortRepositories(useCaseName, ports, repositories) {
  if (!repositories) {
    return;
  }

  Repositories.checkPropTypes(repositories, ports, 'repository', useCaseName);
}
