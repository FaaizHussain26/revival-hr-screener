import { Button } from "../ui/button";

interface RenderPaginationProps {
  currentPage: number;
  lastPages: number;
  handlePageChange: (page: number) => void;
  ITEMS_PER_PAGE: number;
}

export const RenderPagination = ({
  currentPage,
  lastPages,
  handlePageChange,
  ITEMS_PER_PAGE,
}: RenderPaginationProps) => {
  if (lastPages <= 1) return null;
  const pages = [];
  const maxVisiblePages = ITEMS_PER_PAGE;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(lastPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  pages.push(
    <Button
      key="prev"
      variant="outline"
      size="sm"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
  );

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Button
        key={i}
        variant={currentPage === i ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Button>
    );
  }

  pages.push(
    <Button
      key="next"
      variant="outline"
      size="sm"
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === lastPages}
    >
      Next
    </Button>
  );

  return <div className="flex gap-2 justify-center mt-4">{pages}</div>;
};
