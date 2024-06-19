import { Link } from 'react-router-dom';
import './style.scss'
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <div className='Breadcrumb-component'>
      <div className="row">
        <div className="col-12 col-md-12">
          <span className='page-title'>
            <i>{pageName}</i>
          </span>
        </div>
        {/* <div className="col-12 col-md-9 flex-end">
          <ul>
            <li>
              <Link to="/">داشبورد / </Link>
            </li>
            <li>{pageName}</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Breadcrumb;
