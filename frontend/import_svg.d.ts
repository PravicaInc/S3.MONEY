declare module '*.svg?jsx' {
  import React = require('react');

  export default React.FC<React.SVGProps<SVGSVGElement>>;
}
