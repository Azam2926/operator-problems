import { ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/reui/button";
import { useDataGrid } from "@/components/reui/data-grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/reui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface DataGridPaginationProps {
  sizes?: number[];
  sizesInfo?: string;
  sizesLabel?: string;
  sizesDescription?: string;
  sizesSkeleton?: ReactNode;
  more?: boolean;
  moreLimit?: number;
  info?: string;
  infoSkeleton?: ReactNode;
}

function DataGridPagination(props: DataGridPaginationProps) {
  const { table, recordCount, isLoading } = useDataGrid();

  const defaultProps: Partial<DataGridPaginationProps> = {
    sizes: [5, 10, 25, 50, 100],
    sizesLabel: "Show",
    sizesDescription: "per page",
    sizesSkeleton: <Skeleton className="h-8 w-44" />,
    moreLimit: 5,
    more: false,
    info: "{from} - {to} of {count}",
    infoSkeleton: <Skeleton className="h-8 w-60" />,
  };

  const mergedProps: DataGridPaginationProps = { ...defaultProps, ...props };

  const btnBaseClasses = "size-7 p-0 text-sm";
  const btnArrowClasses = btnBaseClasses + " rtl:transform rtl:rotate-180";
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, recordCount);
  const pageCount = table.getPageCount();

  // Replace placeholders in paginationInfo
  const paginationInfo = mergedProps?.info
    ? mergedProps.info
        .replace("{from}", from.toString())
        .replace("{to}", to.toString())
        .replace("{count}", recordCount.toString())
    : `${from} - ${to} of ${recordCount}`;

  // Pagination limit logic
  const paginationMoreLimit = mergedProps?.moreLimit || 5;

  // Determine the start and end of the pagination group
  const currentGroupStart =
    Math.floor(pageIndex / paginationMoreLimit) * paginationMoreLimit;
  const currentGroupEnd = Math.min(
    currentGroupStart + paginationMoreLimit,
    pageCount,
  );

  // Render page buttons based on the current group
  const renderPageButtons = () => {
    const buttons = [];
    for (let i = currentGroupStart; i < currentGroupEnd; i++) {
      buttons.push(
        <Button
          key={i}
          size="xs"
          mode="icon"
          variant="ghost"
          className={cn(btnBaseClasses, "text-muted-foreground", {
            "bg-accent text-accent-foreground": pageIndex === i,
          })}
          onClick={() => {
            if (pageIndex !== i) {
              table.setPageIndex(i);
            }
          }}
        >
          {i + 1}
        </Button>,
      );
    }
    return buttons;
  };

  // Render a "previous" ellipsis button if there are previous pages to show
  const renderEllipsisPrevButton = () => {
    if (currentGroupStart > 0) {
      return (
        <Button
          size="xs"
          mode="icon"
          className={btnBaseClasses}
          variant="ghost"
          onClick={() => table.setPageIndex(currentGroupStart - 1)}
        >
          ...
        </Button>
      );
    }
    return null;
  };

  // Render a "next" ellipsis button if there are more pages to show after the current group
  const renderEllipsisNextButton = () => {
    if (currentGroupEnd < pageCount) {
      return (
        <Button
          className={btnBaseClasses}
          variant="ghost"
          size="xs"
          mode="icon"
          onClick={() => table.setPageIndex(currentGroupEnd)}
        >
          ...
        </Button>
      );
    }
    return null;
  };

  return (
    <div
      data-slot="data-grid-pagination"
      className="flex grow flex-col flex-wrap items-center justify-between gap-2.5 py-2.5 sm:flex-row sm:py-0"
    >
      <div className="order-2 flex flex-wrap items-center space-x-2.5 pb-2.5 sm:order-1 sm:pb-0">
        {isLoading ? (
          mergedProps?.sizesSkeleton
        ) : (
          <>
            <div className="text-muted-foreground text-sm">Rows per page</div>
            <Select
              value={`${pageSize}`}
              indicatorPosition="right"
              onValueChange={(value) => {
                const newPageSize = Number(value);
                table.setPageSize(newPageSize);
              }}
            >
              <SelectTrigger className="h-8 w-fit" size="sm">
                <SelectValue placeholder={`${pageSize}`} />
              </SelectTrigger>
              <SelectContent side="top" className="min-w-[50px]">
                {mergedProps?.sizes?.map((size: number) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      <div className="order-1 flex flex-col items-center justify-center gap-2.5 pt-2.5 sm:order-2 sm:flex-row sm:justify-end sm:pt-0">
        {isLoading ? (
          mergedProps?.infoSkeleton
        ) : (
          <>
            <div className="text-muted-foreground order-2 text-sm text-nowrap sm:order-1">
              {paginationInfo}
            </div>
            {pageCount > 1 && (
              <div className="order-1 flex items-center space-x-1 sm:order-2">
                <Button
                  size="xs"
                  mode="icon"
                  variant="ghost"
                  className={btnArrowClasses}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="size-4" />
                </Button>

                {renderEllipsisPrevButton()}

                {renderPageButtons()}

                {renderEllipsisNextButton()}

                <Button
                  size="xs"
                  mode="icon"
                  variant="ghost"
                  className={btnArrowClasses}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { DataGridPagination, type DataGridPaginationProps };
