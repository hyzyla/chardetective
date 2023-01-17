import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import {
  UnicodeBlock,
  getCharacterVisualRepresentation,
  getUnicodeBlock,
} from "../utils/unicode";
import { useRouter } from "next/router";
import { base64UrlDecode, base64UrlEncode } from "../utils/base";

const Home: NextPage = () => {
  const { push, query } = useRouter();
  const [higlightedBlock, setHighlightedBlock] =
    useState<UnicodeBlock | null>();

  // Get query value or use default
  const queryValue = (query.value as string) ?? null;
  const value: string =
    queryValue !== null ? base64UrlDecode(queryValue) : "Привіт!";

  /**
   * Update query value
   **/
  const setValue = (value: string) => {
    push({ query: { ...query, value: base64UrlEncode(value) } }, undefined, {
      shallow: true,
    });
  };

  /**
   * Handle block click
   **/
  const onBlockClick = (block: UnicodeBlock) => {
    if (higlightedBlock?.name === block.name) {
      setHighlightedBlock(null);
      return;
    } else {
      setHighlightedBlock(block);
    }
  };

  const valueBlocks = value.split("").map((char, index) => {
    const block = getUnicodeBlock(char);
    return {
      char,
      block,
    };
  });

  /**
   * Update value on textarea change
   **/
  const onValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setHighlightedBlock(null);
  };

  /**
   * Reset value to default
   *
   **/
  const onResetButtonClick = () => {
    const { value, ...resetedQuery } = query;
    push({ query: { ...resetedQuery } }, undefined, {
      shallow: true,
    });
  };

  // Get unique blocks
  const uniqueBlocks: UnicodeBlock[] = valueBlocks
    .map(({ block }) => block)
    .filter((block, index, blocks) => blocks.indexOf(block) === index);

  const opacity = 0.1;

  return (
    <div>
      <Head>
        <title>Character Detector</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100  min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-5 pt-3">
            {/* Header */}
            <h1 className="text-3xl font-bold">Character Detector</h1>
            <p className="text-gray-500">
              Paste any text and see what characters are used in it.
            </p>
            {/* Textarea */}
            <TextareaAutosize
              className="shadow-sm rounded p-2 w-full resize-none font-mono"
              value={value}
              minRows={5}
              onChange={onValueChange}
            />
            {/* Reset button */}
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onResetButtonClick}
              >
                Reset
              </button>
            </div>
            {/* Characters */}
            <div className="shadow-sm rounded p-2 min-h-[50px] w-full bg-white grid gap-[2px] grid-cols-[repeat(auto\-fill,2.5rem)]">
              {valueBlocks.map(({ char, block }, index) => {
                const color = block.color;
                const isHighlighted = higlightedBlock?.name === block.name;
                const isActive = isHighlighted || !higlightedBlock;
                const visualChar = getCharacterVisualRepresentation(char);
                return (
                  <div
                    className="rounded w-10 h-10 flex items-center justify-center border-[1px] text-white cursor-pointer select-none"
                    style={{
                      backgroundColor: color,
                      opacity: isActive ? 1 : opacity,
                    }}
                    key={index}
                    title={block.name}
                    onClick={() => onBlockClick(block)}
                  >
                    {visualChar}
                  </div>
                );
              })}
            </div>
            {/* Blocks */}
            <div className="shadow-sm rounded p-2 min-h-[50px] w-full bg-white grid gap-[2px]">
              {uniqueBlocks.map((block, index) => {
                const isHighlighted = higlightedBlock?.name === block.name;
                const isActive = isHighlighted || !higlightedBlock;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className="rounded h-10 w-10  border-[1px] p-3 text-white cursor-pointer select-none"
                      style={{
                        backgroundColor: block.color,
                        opacity: isActive ? 1 : opacity,
                      }}
                      title={block.name}
                      onClick={() => onBlockClick(block)}
                    />
                    <div>{block.name}</div>
                    <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                    {block.wiki && (
                      <a
                        className="flex items-center space-x-1 text-blue-500"
                        href={block.wiki}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        wiki
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Footer */}
            <div className="text-gray-500 text-sm">
              <div>
                Made in 🇺🇦 by{" "}
                <a
                  href="https://hyzyla.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Yevhenii Hyzyla
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
