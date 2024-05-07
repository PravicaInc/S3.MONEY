import apis from './api';
import basicInfo from './basicInfo';
import servers from './servers';
import tags from './tags';

export default module.exports = {
  ...basicInfo,
  ...servers,
  ...tags,
  ...apis,
};
