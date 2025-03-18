'use client';

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import Image from "next/image";
import { Post } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

const HistoryPage = ({posts}: {posts: Post[]}) => {
  const [loading] = useState(false);

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow-md overflow-y-auto">
      <h1 className="text-2xl font-bold text-purple-950 text-center mb-4">
        Event History
      </h1>
      <ScrollArea className="h-screen rounded-lg overflow-x-auto overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
        {loading ? (
          <Skeleton className="w-full h-16" />
        ) : (
          posts.map((post,index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex flex-col flex-1">
                  <h2 className="font-semibold text-lg">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {post.description}
                  </p>
                  <span className="text-xs text-gray-500">
                    {format(post.createdAt, "PPpp")}
                  </span>
                </div>
                <div className="w-12 h-12 flex-shrink-0">
                  <Image
                    src={post.imageUrl || "/icons/event.svg"}
                    alt={post.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryPage;
