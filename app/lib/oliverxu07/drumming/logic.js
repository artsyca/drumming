function getResultantPatterns(allPatterns, numNotes, rhythmicStability, melodicContour) {
	var patterns = new Array();
	for (let pattern of allPatterns) {
		if (countNotes(pattern) == numNotes && countStableBeats(pattern) == rhythmicStability && countMelodicTurns(pattern) == melodicContour) {
			patterns.push(pattern);
		}
  }
  return patterns;
}

// 0-10 notes possible
function countNotes(pattern) {
	var count = 0;
	for (var i = 0; i < pattern.length; i++) {
		if (pattern[i] != -1) {
			count++;
		}
	}
	return count;
}

// 0-3 stable beats possible
function countStableBeats(pattern) {
	return (pattern[0] != -1) + (pattern[4] != -1) + (pattern[8] != -1);
}

// number of turns in melodic contour, including from last note to first note in the pattern
// 0-5 turns possible
function countMelodicTurns(pattern) {
	var i = 0;
	var melody = new Array();
	// melody consists of the sequence of notes in the pattern without rests
	for (var i = 0; i < pattern.length; i++) {
		if (pattern[i] != -1) {
			melody.push(pattern[i]);
		}
	}
	var numTurns = 0;
	var ascending = 0;
	var descending = 0;
	var currentNote;
	var nextNote;
	for (var i = 0; i < melody.length; i++) {
		currentNote = melody[i];
		if (i == (melody.length - 1)) {
			// compare last note with first note of pattern
			nextNote = melody[0];
		}
		else {
			// compare current note with next note of pattern
			nextNote = melody[i+1];
		}
		if (nextNote - currentNote > 0) {
			// next note is higher
			if (!ascending && !descending) {
				// pattern begins with ascending contour
				ascending = 1;
			}
			else if (descending) {
				// found a turn, previously descending but now ascending
				ascending = 1;
				descending = 0;
				numTurns++;
			}
		}
		else if (nextNote - currentNote < 0) {
			// next note is lower
			if (!ascending && !descending) {
				// pattern begins with descending contour
				descending = 1;
			}
			else if (ascending) {
				// found a turn, previously ascending but now descending
				descending = 1;
				ascending = 0;
				numTurns++;
			}
		}
	}
	return numTurns;
}

// create the composite resultant pattern from two individual patterns
function createComposite(drummer1, drummer2) {
	// composite will be an array of arrays
	var composite = new Array(12);
	var numPatterns = 1;

	// iterate through the 12 8th notes in a bar of 12/8
	for (var i = 0; i < composite.length; i++) {
		if (drummer1[i] != -1 && drummer2[i] != -1) {
			// composite[i] has 3 possibilities: note1, note2, or rest
			composite[i] = [drummer1[i], drummer2[i], -1];
		}
		else if (drummer1[i] == -1 && drummer2[i] == -1) {
			// composite[i] has 1 possibility: rest
			composite[i] = [-1];
		}
		else {
			// compsite[i] has 2 possibilities: note or rest
			composite[i] = [drummer1[i], drummer2[i]];
		}
		// calculate the number of patterns possible so far
		numPatterns *= composite[i].length;
	}
	return composite;
}

function nextPattern(patterns) {
    if (!patterns || patterns.length == 0) {
      return;
    }
    var randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    return randomPattern;
}

function genAllPatterns(composite) {
	// indices represents the number of possibilities used at each 8th note so far in our generation process (index of subarray)
	var indices = new Array(12);
	for (var i = 0; i < indices.length; i++) {
		indices[i] = 0;
	}

	var allPatterns = [];
	let n = 12;
	while (1) {
		var pattern = new Array(n);
		// generate one pattern
		for (var i = 0; i < n; i++) {
			pattern[i] = composite[i][indices[i]];
		}
		allPatterns.push(pattern);
		// next is an index for composite that refers to the next array that will be iterated through
		var next = n - 1;
		// check to see if possibilities at index next still exist
		while (next >= 0 && (indices[next] + 1 >= composite[next].length)) {
			// if there are one or zero possibilities remaining, decrement next so that in the next iteration of the outer loop, we iterate through the next subarray that has possibilities remaining
			next--;
		}
		if (next < 0) {
			// done with generation process
			break;
		}
		// in the next iteration of the outer loop, we will use one more possibility at composite[next]
		indices[next] += 1;
		// reset indices to the right of next
		for (var i = next + 1; i < n; i++) {
			indices[i] = 0;
		}
	}
	return allPatterns;
}

function createLine(pattern) {
	var line = new Array();
	for (let note of pattern) {
		line.push(getNote(note));
	}
	return line.join();
}

/*
* rest -1
* G# 0
* A# 2
* B 3
* C# 5
*/
function getNote(num) {
	switch (num) {
		case -1:
			return 'e3/r';
		case 0:
			return 'g3/8';
		case 2:
			return 'a3/8';
		case 3:
			return 'b3/8';
		case 5:
			return 'c4/8';
	}
}

export {
  nextPattern,
  createComposite,
  genAllPatterns,
  createLine,
  getResultantPatterns
};
