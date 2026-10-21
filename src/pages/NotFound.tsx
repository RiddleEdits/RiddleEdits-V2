import { Link } from '../router';

export function NotFound() {
  return (
    <div className="wrap flex min-h-[70vh] flex-col justify-center pb-24 pt-40">
      <p className="label">Error · 404</p>
      <h1 className="mt-6 text-[48px] font-semibold tracking-[-0.045em] text-ink md:text-[72px]">This frame was cut.</h1>
      <p className="mt-4 max-w-[420px] text-[17px] text-ink-2">The page you’re looking for doesn’t exist, or it moved.</p>
      <div className="mt-10 flex gap-3">
        <Link to="/" className="btn btn-primary">
          Home
        </Link>
        <Link to="/work/" className="btn btn-quiet">
          See the work
        </Link>
      </div>
    </div>
  );
}
